/*
# Multiplayer RLS simplification — deny direct client access, expose RPCs only

The previous migration enabled RLS but added policies that rely on a
session GUC (`app.current_player_id`) that the anon-key frontend cannot
easily set. To keep the security model simple and bulletproof, this
migration drops those policies and replaces them with deny-by-default
RLS: the anon and authenticated roles get NO direct SELECT/INSERT/
UPDATE/DELETE on mp_rooms, mp_players, or mp_answers.

All client access happens through SECURITY DEFINER RPCs added in the
next migration (`mp_*` functions). The functions run as the table owner
and return only the rows the calling player is allowed to see — the
caller's own row, the opponent's public-facing fields (nickname, score,
lives, status, finished_at), and the next question for the caller only.

Realtime updates are also delivered through a SECURITY DEFINER function
the frontend polls (or a Postgres Changes subscription on a public
shadow view — added separately if needed).
*/

-- Drop the GUC-based policies.
DROP POLICY IF EXISTS "mp_players_select_room_members" ON mp_players;
DROP POLICY IF EXISTS "mp_players_update_own_heartbeat" ON mp_players;
DROP POLICY IF EXISTS "mp_rooms_select_members" ON mp_rooms;

-- Revoke direct table access from anon/authenticated.
REVOKE SELECT ON mp_rooms FROM anon, authenticated;
REVOKE SELECT ON mp_players FROM anon, authenticated;
REVOKE UPDATE (last_seen_at) ON mp_players FROM anon, authenticated;

-- RLS is still enabled (from the previous migration) and now denies
-- everything to anon/authenticated. Only service_role and the owner
-- (which SECURITY DEFINER functions run as) can read/write.
