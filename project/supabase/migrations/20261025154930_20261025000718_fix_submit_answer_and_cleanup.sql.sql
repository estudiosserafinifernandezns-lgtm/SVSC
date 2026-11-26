/*
# Fix mp_submit_answer boolean/int variable collision + clean test data

The previous version declared v_already_answered as boolean, then later
assigned count(*) to the same variable, causing "operator does not exist:
boolean >= integer". This rewrite uses two separate variables.

Also removes the test rooms/players created during development so the
production database starts clean.
*/

-- Clean up development test data.
DELETE FROM mp_answers;
DELETE FROM mp_players;
DELETE FROM mp_rooms;
DELETE FROM mp_quote_index;

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
  v_already boolean;
  v_answer_count int;
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

  SELECT 1 INTO v_already FROM mp_answers
  WHERE player_id = p_player_id AND quote_id = p_quote_id;
  IF v_already THEN
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

  SELECT * INTO v_player FROM mp_players WHERE id = p_player_id;

  IF v_player.lives <= 0 THEN
    UPDATE mp_players SET status = 'lost', finished_at = now() WHERE id = p_player_id;
    v_finished := true;
  ELSE
    SELECT count(*) INTO v_answer_count FROM mp_answers WHERE player_id = p_player_id;
    IF v_answer_count >= v_room.total_questions THEN
      UPDATE mp_players SET status = 'won', finished_at = now() WHERE id = p_player_id;
      v_finished := true;
    END IF;
  END IF;

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

REVOKE EXECUTE ON FUNCTION mp_submit_answer(uuid, int, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION mp_submit_answer(uuid, int, text) TO anon, authenticated;
