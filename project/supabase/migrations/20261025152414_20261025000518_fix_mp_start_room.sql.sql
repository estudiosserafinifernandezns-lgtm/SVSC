/*
# Fix mp_start_room — both-ready check was using count(*) outside aggregate

The previous version used `count(*)` in the IF condition after a
SELECT bool_and(...), but count(*) is not available there. This rewrite
computes both the ready flag and the player count in a single SELECT.
*/

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
  v_ready_count int;
  v_all_lobby boolean;
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

  SELECT count(*), bool_and(status = 'lobby')
  INTO v_ready_count, v_all_lobby
  FROM mp_players
  WHERE room_id = v_room.id AND status <> 'left';

  IF v_ready_count < 2 OR NOT v_all_lobby THEN
    RETURN jsonb_build_object('error', 'Faltan jugadores');
  END IF;

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

REVOKE EXECUTE ON FUNCTION mp_start_room(uuid, int[], jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION mp_start_room(uuid, int[], jsonb) TO anon, authenticated;
