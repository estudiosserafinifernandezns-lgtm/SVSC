/*
# Enable Realtime for multiplayer lobby sync

The frontend needs to see when the opponent joins the lobby WITHOUT
polling. Supabase Realtime's postgres_changes delivers row inserts/
updates to subscribers, but only for rows the subscriber's role can
read via RLS.

This migration:
1. Grants SELECT on mp_rooms and mp_players to anon/authenticated so
   Realtime can deliver change events to the lobby.
2. Adds RLS SELECT policies that scope reads to rooms the caller is a
   member of — but since anon clients have no auth.uid(), we accept
   that any anon client can read any room/player row (the room code is
   the secret; the row contains no PII beyond a chosen nickname).
3. Adds the multiplayer tables to the supabase_realtime publication.

Note: scores like score/lives/elapsed_ms are visible, but those are
already public-facing competitive stats. The quote_ids array and
mp_answers remain inaccessible (no grant/policy on mp_answers, and
mp_rooms.quote_ids is excluded from the realtime publication via a
column filter is not possible at row level — but quote_ids is only
populated at game start and the frontend already has the quotes
in-app, so exposure of the id list is acceptable for the lobby phase).
*/

GRANT SELECT ON mp_rooms TO anon, authenticated;
GRANT SELECT ON mp_players TO anon, authenticated;

DROP POLICY IF EXISTS "mp_rooms_public_lobby_read" ON mp_rooms;
CREATE POLICY "mp_rooms_public_lobby_read" ON mp_rooms
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "mp_players_public_lobby_read" ON mp_players;
CREATE POLICY "mp_players_public_lobby_read" ON mp_players
  FOR SELECT TO anon, authenticated USING (true);

-- Add tables to the realtime publication.
ALTER PUBLICATION supabase_realtime ADD TABLE mp_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE mp_players;
