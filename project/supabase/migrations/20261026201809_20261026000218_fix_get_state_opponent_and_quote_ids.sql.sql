/*
# Fix mp_get_state opponent query to exclude left players

The opponent query used `WHERE room_id = ... AND id <> p_player_id
LIMIT 1` without filtering by status. If a previous player left (status
= 'left') and a new player joined, the query could return the stale
left player as the opponent, showing the wrong nickname.

This fix filters to only non-left active players.
*/

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

  -- Only return an active (non-left) opponent.
  SELECT * INTO v_opponent
  FROM mp_players
  WHERE room_id = v_player.room_id
    AND id <> p_player_id
    AND status <> 'left'
  ORDER BY slot
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
      'next_room_id', v_room.next_room_id,
      'quote_ids', v_room.quote_ids
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
      'streak', v_opponent.streak,
      'best_streak', v_opponent.best_streak,
      'elapsed_ms', v_opponent.elapsed_ms,
      'status', v_opponent.status,
      'started_at', v_opponent.started_at,
      'finished_at', v_opponent.finished_at
    ) END
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION mp_get_state(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION mp_get_state(uuid) TO anon, authenticated;
