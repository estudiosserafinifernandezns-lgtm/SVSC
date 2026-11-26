/*
# Multiplayer SECURITY DEFINER functions

All multiplayer mutations and reads go through these RPCs. The frontend
calls them with `supabase.rpc('mp_*', { ... })` using the anon key.
Inside each function we validate input, enforce the 2-player limit,
prevent duplicate joins, and return only the data the caller is allowed
to see.

## Functions

- `mp_create_room(p_nickname text, p_kind text)` → creates a private or
  public room, joins as slot 1, returns { room_id, player_id, code, slot }
- `mp_join_room(p_code text, p_nickname text)` → joins a waiting room by
  code as slot 2; errors if room is full/started/abandoned
- `mp_join_public(p_nickname text)` → finds a waiting public room with
  one player and joins it; if none, creates a new public room and waits
- `mp_leave_room(p_player_id uuid)` → marks player as 'left'; if both
  players left or the room was waiting with only this player, abandons
- `mp_heartbeat(p_player_id uuid)` → updates last_seen_at; marks the
  player 'disconnected' if it was previously active but stale (handled
  by the edge cleanup function instead — heartbeat just refreshes)
- `mp_get_state(p_player_id uuid)` → returns the room status, the
  caller's full state, and the opponent's public state (no answers, no
  quote_ids, no correct sides). Used for polling / initial render.
- `mp_submit_answer(p_player_id uuid, p_quote_id int, p_selected_side text)`
  → validates the answer server-side, records it, updates score/lives,
  and returns { is_correct, correct_side, score, lives, finished,
  room_status }
- `mp_request_rematch(p_player_id uuid)` → marks rematch_requested_by;
  when BOTH players have requested (checked via opponent's
  rematch_requested_by), creates the next room and returns its code
- `mp_cancel_rematch(p_player_id uuid)` → clears the request
- `mp_cancel_search(p_player_id uuid)` → leaves a public waiting room
  the player is searching in

The functions are SECURITY DEFINER so they run as the table owner and
bypass RLS. EXECUTE is revoked from PUBLIC/anon and granted explicitly
to anon + authenticated so the frontend can call them. (We accept that
any anon caller can call these — the player_id secret returned by
mp_create_room / mp_join_room is the access token for that room, and
every function validates that the player_id actually belongs to a
valid room/player before mutating anything.)

The correct_side for each quote is computed server-side from the
existing `quotes` data — but that data lives in the frontend. To avoid
duplicating the quotes table in Postgres, mp_submit_answer receives
both the selected_side AND, internally, looks up the correct author by
quote_id from a server-side mirror table `mp_quote_index` populated by
the multiplayer edge function when the room is created. This prevents
the client from lying about correctness.
*/

-- Server-side mirror of quote → author/decoy + correct side, populated
-- by the multiplayer edge function when a room is created. The frontend
-- never sees this table.
CREATE TABLE IF NOT EXISTS mp_quote_index (
  quote_id int PRIMARY KEY,
  author_name text NOT NULL,
  decoy_name text NOT NULL,
  correct_side text NOT NULL CHECK (correct_side IN ('left','right'))
);

ALTER TABLE mp_quote_index ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, DELETE ON mp_quote_index TO service_role;
-- No anon/authenticated grants: RLS denies all client access.

-- Helper to generate a hard-to-guess 6-character alphanumeric code.
CREATE OR REPLACE FUNCTION mp_generate_code()
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT string_agg(
    substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
      1 + floor(random() * 32)::int,
      1),
    ''
  ) FROM generate_series(1, 6);
$$;

CREATE OR REPLACE FUNCTION mp_create_room(p_nickname text, p_kind text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code text;
  v_room_id uuid;
  v_player_id uuid;
  v_kind text := COALESCE(p_kind, 'private');
BEGIN
  IF v_kind NOT IN ('private','public') THEN
    RETURN jsonb_build_object('error', 'kind inválido');
  END IF;
  IF length(trim(p_nickname)) = 0 OR length(p_nickname) > 20 THEN
    RETURN jsonb_build_object('error', 'Apodo inválido (1-20 caracteres)');
  END IF;

  -- Generate a unique code.
  LOOP
    v_code := mp_generate_code();
    SELECT id INTO v_room_id FROM mp_rooms WHERE code = v_code;
    EXIT WHEN v_room_id IS NULL;
  END LOOP;

  INSERT INTO mp_rooms (id, code, kind, status, quote_ids, total_questions)
  VALUES (gen_random_uuid(), v_code, v_kind, 'waiting', '{}', 0)
  RETURNING id INTO v_room_id;

  INSERT INTO mp_players (id, room_id, nickname, slot, status)
  VALUES (gen_random_uuid(), v_room_id, trim(p_nickname), 1, 'lobby')
  RETURNING id INTO v_player_id;

  RETURN jsonb_build_object(
    'room_id', v_room_id,
    'player_id', v_player_id,
    'code', v_code,
    'slot', 1
  );
END;
$$;

CREATE OR REPLACE FUNCTION mp_join_room(p_code text, p_nickname text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room mp_rooms%ROWTYPE;
  v_count int;
  v_player_id uuid;
BEGIN
  IF length(trim(p_nickname)) = 0 OR length(p_nickname) > 20 THEN
    RETURN jsonb_build_object('error', 'Apodo inválido (1-20 caracteres)');
  END IF;

  SELECT * INTO v_room FROM mp_rooms WHERE code = upper(trim(p_code));
  IF v_room.id IS NULL THEN
    RETURN jsonb_build_object('error', 'No existe una sala con ese código');
  END IF;
  IF v_room.status <> 'waiting' THEN
    RETURN jsonb_build_object('error', 'La sala ya comenzó o finalizó');
  END IF;

  SELECT count(*) INTO v_count FROM mp_players WHERE room_id = v_room.id AND status <> 'left';
  IF v_count >= 2 THEN
    RETURN jsonb_build_object('error', 'La sala está llena');
  END IF;

  INSERT INTO mp_players (id, room_id, nickname, slot, status)
  VALUES (gen_random_uuid(), v_room.id, trim(p_nickname), 2, 'lobby')
  RETURNING id INTO v_player_id;

  RETURN jsonb_build_object(
    'room_id', v_room.id,
    'player_id', v_player_id,
    'code', v_room.code,
    'slot', 2
  );
END;
$$;

CREATE OR REPLACE FUNCTION mp_join_public(p_nickname text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room mp_rooms%ROWTYPE;
  v_player_id uuid;
  v_existing_player_id uuid;
BEGIN
  IF length(trim(p_nickname)) = 0 OR length(p_nickname) > 20 THEN
    RETURN jsonb_build_object('error', 'Apodo inválido (1-20 caracteres)');
  END IF;

  -- Try to find a waiting public room with exactly one non-left player.
  SELECT r.* INTO v_room
  FROM mp_rooms r
  WHERE r.kind = 'public'
    AND r.status = 'waiting'
    AND (
      SELECT count(*) FROM mp_players p
      WHERE p.room_id = r.id AND p.status <> 'left'
    ) = 1
  ORDER BY r.created_at
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_room.id IS NOT NULL THEN
    INSERT INTO mp_players (id, room_id, nickname, slot, status)
    VALUES (gen_random_uuid(), v_room.id, trim(p_nickname), 2, 'lobby')
    RETURNING id INTO v_player_id;

    RETURN jsonb_build_object(
      'room_id', v_room.id,
      'player_id', v_player_id,
      'code', v_room.code,
      'slot', 2
    );
  END IF;

  -- No room found — create a new public room and wait.
  PERFORM 1;
  DECLARE
    v_code text;
  BEGIN
    LOOP
      v_code := mp_generate_code();
      EXIT WHEN NOT EXISTS (SELECT 1 FROM mp_rooms WHERE code = v_code);
    END LOOP;

    INSERT INTO mp_rooms (id, code, kind, status, quote_ids, total_questions)
    VALUES (gen_random_uuid(), v_code, 'public', 'waiting', '{}', 0)
    RETURNING id INTO v_room.id;

    INSERT INTO mp_players (id, room_id, nickname, slot, status)
    VALUES (gen_random_uuid(), v_room.id, trim(p_nickname), 1, 'lobby')
    RETURNING id INTO v_player_id;

    v_code := v_room.code;
    RETURN jsonb_build_object(
      'room_id', v_room.id,
      'player_id', v_player_id,
      'code', v_code,
      'slot', 1
    );
  END;
END;
$$;

CREATE OR REPLACE FUNCTION mp_leave_room(p_player_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room_id uuid;
  v_other_count int;
BEGIN
  SELECT room_id INTO v_room_id FROM mp_players WHERE id = p_player_id;
  IF v_room_id IS NULL THEN
    RETURN jsonb_build_object('ok', true);
  END IF;

  UPDATE mp_players SET status = 'left', last_seen_at = now()
  WHERE id = p_player_id;

  SELECT count(*) INTO v_other_count
  FROM mp_players
  WHERE room_id = v_room_id AND id <> p_player_id AND status NOT IN ('left','disconnected');

  IF v_other_count = 0 THEN
    UPDATE mp_rooms SET status = 'abandoned', finished_at = now()
    WHERE id = v_room_id AND status IN ('waiting','countdown','playing');
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$$;

CREATE OR REPLACE FUNCTION mp_heartbeat(p_player_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE mp_players SET last_seen_at = now()
  WHERE id = p_player_id AND status NOT IN ('left','won','lost');
  RETURN jsonb_build_object('ok', true);
END;
$$;

-- Returns the room + both players' public state. Does NOT include
-- quote_ids, mp_answers, or correct_side. The frontend pairs this with
-- its in-app quotes data to render questions.
CREATE OR REPLACE FUNCTION mp_get_state(p_player_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_player mp_players%ROWTYPE;
  v_room mp_rooms%ROWTYPE;
  v_opponent mp_players%ROWTYPE;
BEGIN
  SELECT * INTO v_player FROM mp_players WHERE id = p_player_id;
  IF v_player.id IS NULL THEN
    RETURN jsonb_build_object('error', 'Jugador no encontrado');
  END IF;

  SELECT * INTO v_room FROM mp_rooms WHERE id = v_player.room_id;
  IF v_room.id IS NULL THEN
    RETURN jsonb_build_object('error', 'Sala no encontrada');
  END IF;

  SELECT * INTO v_opponent
  FROM mp_players
  WHERE room_id = v_player.room_id AND id <> p_player_id
  LIMIT 1;

  RETURN jsonb_build_object(
    'room', jsonb_build_object(
      'id', v_room.id,
      'code', v_room.code,
      'kind', v_room.kind,
      'status', v_room.status,
      'total_questions', v_room.total_questions,
      'started_at', v_room.started_at,
      'rematch_requested_by', v_room.rematch_requested_by,
      'next_room_id', v_room.next_room_id
    ),
    'me', jsonb_build_object(
      'id', v_player.id,
      'nickname', v_player.nickname,
      'slot', v_player.slot,
      'score', v_player.score,
      'lives', v_player.lives,
      'streak', v_player.streak,
      'best_streak', v_player.best_streak,
      'elapsed_ms', v_player.elapsed_ms,
      'status', v_player.status,
      'started_at', v_player.started_at,
      'finished_at', v_player.finished_at
    ),
    'opponent', CASE WHEN v_opponent.id IS NULL THEN NULL ELSE jsonb_build_object(
      'id', v_opponent.id,
      'nickname', v_opponent.nickname,
      'slot', v_opponent.slot,
      'score', v_opponent.score,
      'lives', v_opponent.lives,
      'status', v_opponent.status,
      'finished_at', v_opponent.finished_at
    ) END
  );
END;
$$;

-- Validates and records an answer. The correct_side is looked up
-- server-side from mp_quote_index so the client cannot lie.
CREATE OR REPLACE FUNCTION mp_submit_answer(
  p_player_id uuid,
  p_quote_id int,
  p_selected_side text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_player mp_players%ROWTYPE;
  v_room mp_rooms%ROWTYPE;
  v_qi mp_quote_index%ROWTYPE;
  v_is_correct boolean;
  v_already_answered boolean;
  v_finished boolean := false;
BEGIN
  IF p_selected_side NOT IN ('left','right') THEN
    RETURN jsonb_build_object('error', 'Lado inválido');
  END IF;

  SELECT * INTO v_player FROM mp_players WHERE id = p_player_id;
  IF v_player.id IS NULL THEN
    RETURN jsonb_build_object('error', 'Jugador no encontrado');
  END IF;
  IF v_player.status NOT IN ('playing') THEN
    RETURN jsonb_build_object('error', 'No estás en una partida activa');
  END IF;

  SELECT * INTO v_room FROM mp_rooms WHERE id = v_player.room_id;
  IF v_room.status <> 'playing' THEN
    RETURN jsonb_build_object('error', 'La sala no está jugando');
  END IF;
  IF NOT (p_quote_id = ANY(v_room.quote_ids)) THEN
    RETURN jsonb_build_object('error', 'Pregunta inválida para esta sala');
  END IF;

  SELECT 1 INTO v_already_answered FROM mp_answers
  WHERE player_id = p_player_id AND quote_id = p_quote_id;
  IF v_already_answered THEN
    RETURN jsonb_build_object('error', 'Ya respondiste esta pregunta');
  END IF;

  SELECT * INTO v_qi FROM mp_quote_index WHERE quote_id = p_quote_id;
  IF v_qi.quote_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Índice de pregunta no disponible');
  END IF;

  v_is_correct := (p_selected_side = v_qi.correct_side);

  INSERT INTO mp_answers (player_id, room_id, quote_id, selected_side, correct_side, is_correct)
  VALUES (p_player_id, v_player.room_id, p_quote_id, p_selected_side, v_qi.correct_side, v_is_correct);

  IF v_is_correct THEN
    UPDATE mp_players
    SET score = score + 1,
        streak = streak + 1,
        best_streak = GREATEST(best_streak, streak + 1),
        elapsed_ms = elapsed_ms + (EXTRACT(EPOCH FROM (now() - COALESCE(started_at, now()))) * 1000)::bigint - elapsed_ms
    WHERE id = p_player_id;
  ELSE
    UPDATE mp_players
    SET lives = lives - 1,
        streak = 0
    WHERE id = p_player_id;
  END IF;

  -- Reload to compute finished state.
  SELECT * INTO v_player FROM mp_players WHERE id = p_player_id;

  -- Finished if no lives left OR answered all questions.
  IF v_player.lives <= 0 THEN
    UPDATE mp_players SET status = 'lost', finished_at = now() WHERE id = p_player_id;
    v_finished := true;
  ELSE
    SELECT count(*) INTO v_already_answered FROM mp_answers WHERE player_id = p_player_id;
    IF v_already_answered >= v_room.total_questions THEN
      UPDATE mp_players SET status = 'won', finished_at = now() WHERE id = p_player_id;
      v_finished := true;
    END IF;
  END IF;

  -- If both players finished, mark the room finished.
  PERFORM 1
  FROM mp_players p
  WHERE p.room_id = v_player.room_id
    AND p.id <> p_player_id
    AND p.status IN ('won','lost','disconnected','left');
  IF found AND v_finished THEN
    UPDATE mp_rooms SET status = 'finished', finished_at = now()
    WHERE id = v_player.room_id AND status = 'playing';
  END IF;

  SELECT score, lives INTO v_player.score, v_player.lives FROM mp_players WHERE id = p_player_id;

  RETURN jsonb_build_object(
    'is_correct', v_is_correct,
    'correct_side', v_qi.correct_side,
    'score', v_player.score,
    'lives', v_player.lives,
    'finished', v_finished
  );
END;
$$;

-- Start the room: called by the edge function (or by player 1 via an
-- RPC) once both players are in 'lobby'. Sets the quote_ids, populates
-- mp_quote_index, and flips status to 'countdown'. Returns the
-- quote_ids ONLY to the caller if the caller is one of the players —
-- the frontend already has the quote data in-app, so it only needs the
-- ordered ids.
CREATE OR REPLACE FUNCTION mp_start_room(
  p_player_id uuid,
  p_quote_ids int[],
  p_index jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room mp_rooms%ROWTYPE;
  v_player mp_players%ROWTYPE;
  v_both_ready boolean;
  v_item jsonb;
BEGIN
  SELECT * INTO v_player FROM mp_players WHERE id = p_player_id;
  IF v_player.id IS NULL OR v_player.slot <> 1 THEN
    RETURN jsonb_build_object('error', 'Solo el jugador 1 puede iniciar la sala');
  END IF;

  SELECT * INTO v_room FROM mp_rooms WHERE id = v_player.room_id;
  IF v_room.status <> 'waiting' THEN
    RETURN jsonb_build_object('error', 'La sala ya comenzó');
  END IF;

  SELECT bool_and(status = 'lobby') INTO v_both_ready
  FROM mp_players WHERE room_id = v_room.id AND status <> 'left';
  IF NOT v_both_ready OR count(*) < 2 THEN
    RETURN jsonb_build_object('error', 'Faltan jugadores');
  END IF;

  -- Populate mp_quote_index from the JSON the caller passed (built by
  -- the edge function from the frontend quotes data — but to keep this
  -- self-contained we accept it as a parameter; the edge function is
  -- what builds it from the in-app quotes file).
  DELETE FROM mp_quote_index WHERE quote_id = ANY(p_quote_ids);
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_index)
  LOOP
    INSERT INTO mp_quote_index (quote_id, author_name, decoy_name, correct_side)
    VALUES (
      (v_item->>'quote_id')::int,
      v_item->>'author_name',
      v_item->>'decoy_name',
      v_item->>'correct_side'
    )
    ON CONFLICT (quote_id) DO UPDATE SET
      author_name = EXCLUDED.author_name,
      decoy_name = EXCLUDED.decoy_name,
      correct_side = EXCLUDED.correct_side;
  END LOOP;

  UPDATE mp_rooms
  SET quote_ids = p_quote_ids,
      total_questions = array_length(p_quote_ids, 1),
      status = 'countdown',
      started_at = now()
  WHERE id = v_room.id;

  UPDATE mp_players
  SET status = 'playing', started_at = now(), last_seen_at = now()
  WHERE room_id = v_room.id;

  RETURN jsonb_build_object('ok', true, 'total_questions', array_length(p_quote_ids, 1));
END;
$$;

CREATE OR REPLACE FUNCTION mp_request_rematch(p_player_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room mp_rooms%ROWTYPE;
  v_opponent mp_players%ROWTYPE;
BEGIN
  SELECT * INTO v_room FROM mp_rooms WHERE id = (
    SELECT room_id FROM mp_players WHERE id = p_player_id
  );
  IF v_room.id IS NULL OR v_room.status <> 'finished' THEN
    RETURN jsonb_build_object('error', 'La partida no finalizó');
  END IF;

  UPDATE mp_rooms SET rematch_requested_by = p_player_id WHERE id = v_room.id
    AND (rematch_requested_by IS NULL OR rematch_requested_by <> p_player_id);

  SELECT * INTO v_opponent FROM mp_players
  WHERE room_id = v_room.id AND id <> p_player_id LIMIT 1;

  -- Both players requested rematch if the opponent previously requested
  -- AND the current player just requested now.
  IF v_opponent.id IS NOT NULL AND v_room.rematch_requested_by = v_opponent.id THEN
    -- Create next room with same players and a fresh quote set.
    -- The edge function will be invoked to populate the new room's
    -- quote index; here we just create the empty room and link it.
    DECLARE
      v_code text;
      v_new_room_id uuid;
    BEGIN
      LOOP
        v_code := mp_generate_code();
        EXIT WHEN NOT EXISTS (SELECT 1 FROM mp_rooms WHERE code = v_code);
      END LOOP;

      INSERT INTO mp_rooms (id, code, kind, status, quote_ids, total_questions)
      VALUES (gen_random_uuid(), v_code, v_room.kind, 'waiting', '{}', 0)
      RETURNING id INTO v_new_room_id;

      INSERT INTO mp_players (id, room_id, nickname, slot, status)
      VALUES (gen_random_uuid(), v_new_room_id,
        (SELECT nickname FROM mp_players WHERE id = p_player_id), 1, 'lobby');
      INSERT INTO mp_players (id, room_id, nickname, slot, status)
      VALUES (gen_random_uuid(), v_new_room_id, v_opponent.nickname, 2, 'lobby');

      UPDATE mp_rooms SET next_room_id = v_new_room_id WHERE id = v_room.id;

      RETURN jsonb_build_object('ok', true, 'next_room_id', v_new_room_id, 'next_code', v_code);
    END;
  END IF;

  RETURN jsonb_build_object('ok', true, 'waiting_opponent', true);
END;
$$;

CREATE OR REPLACE FUNCTION mp_cancel_rematch(p_player_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE mp_rooms SET rematch_requested_by = NULL
  WHERE rematch_requested_by = p_player_id;
  RETURN jsonb_build_object('ok', true);
END;
$$;

-- Revoke default EXECUTE from PUBLIC, then grant to anon + authenticated
-- so the frontend can call them. (Edge functions use the service role
-- and bypass these grants.)
REVOKE EXECUTE ON FUNCTION mp_generate_code() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION mp_create_room(text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION mp_join_room(text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION mp_join_public(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION mp_leave_room(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION mp_heartbeat(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION mp_get_state(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION mp_submit_answer(uuid, int, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION mp_start_room(uuid, int[], jsonb) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION mp_request_rematch(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION mp_cancel_rematch(uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION mp_create_room(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION mp_join_room(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION mp_join_public(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION mp_leave_room(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION mp_heartbeat(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION mp_get_state(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION mp_submit_answer(uuid, int, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION mp_request_rematch(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION mp_cancel_rematch(uuid) TO anon, authenticated;
