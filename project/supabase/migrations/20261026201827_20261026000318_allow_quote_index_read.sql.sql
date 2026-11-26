/*
# Allow clients to read mp_quote_index for rendering questions

The MultiplayerGame screen needs to read the quote index to render
each question (author/decoy names and which side is correct). RLS was
enabled but had no SELECT policy, blocking all reads.

The correct_side column is needed by the client to render left/right
placement, but answer validation happens server-side in
mp_submit_answer, so exposing it is safe — the player sees the same
info as in solo mode (just the placement, validated on submit).
*/

GRANT SELECT ON mp_quote_index TO anon, authenticated;

DROP POLICY IF EXISTS "mp_quote_index_read" ON mp_quote_index;
CREATE POLICY "mp_quote_index_read" ON mp_quote_index
  FOR SELECT TO anon, authenticated USING (true);
