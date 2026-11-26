/*
# Add mp_begin_play — transition room from 'countdown' to 'playing'

After mp_start_room sets the room to 'countdown' (during the 3-second
countdown animation in the frontend), the frontend calls mp_begin_play
to flip the room to 'playing' so mp_submit_answer is accepted.

Either player may call this; it is idempotent.
*/

CREATE OR REPLACE FUNCTION mp_begin_play(p_player_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_room_id uuid;
BEGIN
  SELECT room_id INTO v_room_id FROM mp_players WHERE id = p_player_id;
  IF v_room_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Jugador no encontrado');
  END IF;

  UPDATE mp_rooms SET status = 'playing'
  WHERE id = v_room_id AND status = 'countdown';

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE EXECUTE ON FUNCTION mp_begin_play(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION mp_begin_play(uuid) TO anon, authenticated;
