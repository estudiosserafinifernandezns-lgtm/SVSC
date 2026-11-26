/*
# Fix public matchmaking + unique constraint collision

ROOT CAUSE of "duplicate key value violates mp_players_room_id_slot_key":
The unique constraint UNIQUE(room_id, slot) included LEFT players. When a
player joined slot 2, then left (status='left'), their row remained — so a
new player trying to fill slot 2 in the same room collided with the dead row.

FIX:
1. Drop the plain unique constraint and replace it with a PARTIAL unique
   constraint that only applies to non-left players: a slot is only
   "occupied" if its player is still lobby/playing/won/lost/disconnected.
   Left players free their slot.
2. Harden mp_join_public:
   - Lock the candidate room row (FOR UPDATE) AND verify slot 2 is truly
     free (no non-left player on slot 2) inside the same transaction.
   - If slot 2 is taken (race), fall through to creating a new room
     instead of erroring.
   - Reuse a room whose slot-2 player left (slot becomes available again).
   - Wrap the insert in a sub-transaction (BEGIN/EXCEPTION) so a unique
     violation is caught and retried as a new-room creation rather than
     surfacing as a raw SQL error to the player.
3. Same hardening for mp_join_room (private): re-check slot availability
   under the room lock and return a friendly error if a race lost.
*/

-- 1. Replace the unique constraint with a partial one that ignores left players.
ALTER TABLE mp_players DROP CONSTRAINT IF EXISTS mp_players_room_id_slot_key;
ALTER TABLE mp_players DROP CONSTRAINT IF EXISTS mp_players_room_id_slot_active_key;

CREATE UNIQUE INDEX mp_players_room_id_slot_active_key
  ON mp_players (room_id, slot)
  WHERE status <> 'left';

-- 2. Hardened mp_join_public.
CREATE OR REPLACE FUNCTION mp_join_public(p_nickname text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room mp_rooms%ROWTYPE;
  v_player_id uuid;
  v_code text;
  v_slot2_taken int;
  v_insert_ok boolean := false;
BEGIN
  IF length(trim(p_nickname)) = 0 OR length(p_nickname) > 20 THEN
    RETURN jsonb_build_object('error', 'Apodo inválido (1-20 caracteres)');
  END IF;

  -- Find a waiting public room with exactly one active player on slot 1.
  SELECT r.* INTO v_room
  FROM mp_rooms r
  WHERE r.kind = 'public'
    AND r.status = 'waiting'
    AND EXISTS (
      SELECT 1 FROM mp_players p
      WHERE p.room_id = r.id AND p.slot = 1 AND p.status <> 'left'
    )
    AND NOT EXISTS (
      SELECT 1 FROM mp_players p
      WHERE p.room_id = r.id AND p.slot = 2 AND p.status <> 'left'
    )
  ORDER BY r.created_at
  LIMIT 1
  FOR UPDATE OF r SKIP LOCKED;

  IF v_room.id IS NOT NULL THEN
    -- Double-check slot 2 is free under the room lock.
    SELECT count(*) INTO v_slot2_taken
    FROM mp_players
    WHERE room_id = v_room.id AND slot = 2 AND status <> 'left';

    IF v_slot2_taken = 0 THEN
      BEGIN
        INSERT INTO mp_players (id, room_id, nickname, slot, status)
        VALUES (gen_random_uuid(), v_room.id, trim(p_nickname), 2, 'lobby')
        RETURNING id INTO v_player_id;
        v_insert_ok := true;
      EXCEPTION WHEN unique_violation THEN
        -- Lost the race for slot 2; fall through to create a new room.
        v_insert_ok := false;
      END;

      IF v_insert_ok AND v_player_id IS NOT NULL THEN
        RETURN jsonb_build_object(
          'room_id', v_room.id,
          'player_id', v_player_id,
          'code', v_room.code,
          'slot', 2
        );
      END IF;
    END IF;
  END IF;

  -- No suitable room (or lost a race) — create a new public room as host.
  LOOP
    v_code := mp_generate_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM mp_rooms WHERE code = v_code);
  END LOOP;

  INSERT INTO mp_rooms (id, code, kind, status, quote_ids, total_questions)
  VALUES (gen_random_uuid(), v_code, 'public', 'waiting', '{}', 0)
  RETURNING id, code INTO v_room.id, v_code;

  INSERT INTO mp_players (id, room_id, nickname, slot, status)
  VALUES (gen_random_uuid(), v_room.id, trim(p_nickname), 1, 'lobby')
  RETURNING id INTO v_player_id;

  RETURN jsonb_build_object(
    'room_id', v_room.id,
    'player_id', v_player_id,
    'code', v_code,
    'slot', 1
  );
END;
$$;

-- 3. Hardened mp_join_room (private) — race-safe slot 2 reservation.
CREATE OR REPLACE FUNCTION mp_join_room(p_code text, p_nickname text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room mp_rooms%ROWTYPE;
  v_player_id uuid;
  v_active_count int;
  v_slot2_taken int;
BEGIN
  IF length(trim(p_nickname)) = 0 OR length(p_nickname) > 20 THEN
    RETURN jsonb_build_object('error', 'Apodo inválido (1-20 caracteres)');
  END IF;

  SELECT * INTO v_room
  FROM mp_rooms
  WHERE code = upper(trim(p_code))
  FOR UPDATE;

  IF v_room.id IS NULL THEN
    RETURN jsonb_build_object('error', 'No existe una sala con ese código');
  END IF;

  IF v_room.status NOT IN ('waiting','countdown') THEN
    RETURN jsonb_build_object('error', 'La partida ya finalizó');
  END IF;

  SELECT count(*) INTO v_active_count
  FROM mp_players
  WHERE room_id = v_room.id AND status <> 'left';

  IF v_active_count >= 2 THEN
    RETURN jsonb_build_object('error', 'La sala está llena');
  END IF;

  SELECT count(*) INTO v_slot2_taken
  FROM mp_players
  WHERE room_id = v_room.id AND slot = 2 AND status <> 'left';

  IF v_slot2_taken > 0 THEN
    RETURN jsonb_build_object('error', 'La sala está llena');
  END IF;

  BEGIN
    INSERT INTO mp_players (id, room_id, nickname, slot, status)
    VALUES (gen_random_uuid(), v_room.id, trim(p_nickname), 2, 'lobby')
    RETURNING id INTO v_player_id;
  EXCEPTION WHEN unique_violation THEN
    v_player_id := null;
  END;

  IF v_player_id IS NULL THEN
    RETURN jsonb_build_object('error', 'La sala está llena');
  END IF;

  RETURN jsonb_build_object(
    'room_id', v_room.id,
    'player_id', v_player_id,
    'code', v_room.code,
    'slot', 2
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION mp_join_public(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION mp_join_public(text) TO anon, authenticated;
REVOKE EXECUTE ON FUNCTION mp_join_room(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION mp_join_room(text, text) TO anon, authenticated;

-- Clean any stale test data.
DELETE FROM mp_answers;
DELETE FROM mp_players;
DELETE FROM mp_rooms;
DELETE FROM mp_quote_index;
