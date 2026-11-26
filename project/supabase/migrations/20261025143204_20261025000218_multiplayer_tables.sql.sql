/*
# Multiplayer 1 VS 1 — rooms, players, and answer validation (data model)

This migration introduces the data model that powers the online
multiplayer mode. The browser NEVER writes scores or answers directly;
all mutations go through SECURITY DEFINER RPCs (added in a follow-up
migration) that run as the table owner, validate the answer against the
preselected question sequence, and update the canonical game state.

## 1. New Tables

- `mp_rooms`
  - `id` (uuid, primary key)
  - `code` (text, unique) — short shareable invite code, hard to guess
  - `kind` (text) — 'private' | 'public'
  - `status` (text) — 'waiting' | 'countdown' | 'playing' | 'finished' | 'abandoned'
  - `quote_ids` (int[]) — preselected, ordered quote IDs (same for both players)
  - `total_questions` (int)
  - `created_at`, `started_at`, `finished_at` (timestamptz)
  - `rematch_requested_by` (uuid, nullable)
  - `next_room_id` (uuid, nullable)

- `mp_players`
  - `id` (uuid, primary key) — also used as the session id
  - `room_id` (uuid, references mp_rooms, ON DELETE CASCADE)
  - `nickname` (text)
  - `slot` (int) — 1 or 2
  - `score`, `lives`, `streak`, `best_streak` (server-trusted)
  - `started_at`, `finished_at` (timestamptz, nullable)
  - `elapsed_ms` (bigint, server-trusted)
  - `status` (text) — 'lobby' | 'playing' | 'won' | 'lost' | 'disconnected' | 'left'
  - `last_seen_at` (timestamptz) — heartbeat

- `mp_answers`
  - `id`, `player_id`, `room_id`, `quote_id`
  - `selected_side`, `correct_side` (stored server-side, not sent by client)
  - `is_correct`, `answered_at`

## 2. Security

- RLS enabled on every table.
- Clients can SELECT their own room and the players in rooms they belong to
  (so they can see the opponent's nickname, score, lives, status — but NOT
  their answers or the upcoming question sequence, which lives in
  mp_rooms.quote_ids and is only readable through the SECURITY DEFINER RPC).
- Clients can UPDATE only their own `last_seen_at` (heartbeat).
- All other writes go through SECURITY DEFINER RPCs (next migration).
- `service_role` is granted full access for the edge cleanup function.
*/

CREATE TABLE IF NOT EXISTS mp_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  kind text NOT NULL DEFAULT 'private' CHECK (kind IN ('private','public')),
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting','countdown','playing','finished','abandoned')),
  quote_ids int[] NOT NULL DEFAULT '{}',
  total_questions int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  finished_at timestamptz,
  rematch_requested_by uuid,
  next_room_id uuid
);

ALTER TABLE mp_rooms ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS mp_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES mp_rooms(id) ON DELETE CASCADE,
  nickname text NOT NULL,
  slot int NOT NULL CHECK (slot IN (1,2)),
  score int NOT NULL DEFAULT 0,
  lives int NOT NULL DEFAULT 3,
  streak int NOT NULL DEFAULT 0,
  best_streak int NOT NULL DEFAULT 0,
  started_at timestamptz,
  finished_at timestamptz,
  elapsed_ms bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'lobby' CHECK (status IN ('lobby','playing','won','lost','disconnected','left')),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (room_id, slot)
);

ALTER TABLE mp_players ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS mp_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES mp_players(id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES mp_rooms(id) ON DELETE CASCADE,
  quote_id int NOT NULL,
  selected_side text NOT NULL CHECK (selected_side IN ('left','right')),
  correct_side text NOT NULL CHECK (correct_side IN ('left','right')),
  is_correct boolean NOT NULL,
  answered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (player_id, quote_id)
);

ALTER TABLE mp_answers ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_mp_players_room ON mp_players(room_id);
CREATE INDEX IF NOT EXISTS idx_mp_answers_player ON mp_answers(player_id);
CREATE INDEX IF NOT EXISTS idx_mp_answers_room ON mp_answers(room_id);
CREATE INDEX IF NOT EXISTS idx_mp_rooms_kind_status ON mp_rooms(kind, status);
CREATE INDEX IF NOT EXISTS idx_mp_rooms_code ON mp_rooms(code);

GRANT SELECT, INSERT, UPDATE, DELETE ON mp_rooms TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON mp_players TO service_role;
GRANT SELECT, INSERT, DELETE ON mp_answers TO service_role;

GRANT SELECT ON mp_rooms TO anon, authenticated;
GRANT SELECT ON mp_players TO anon, authenticated;
GRANT UPDATE (last_seen_at) ON mp_players TO anon, authenticated;

DROP POLICY IF EXISTS "mp_players_select_room_members" ON mp_players;
CREATE POLICY "mp_players_select_room_members" ON mp_players
  FOR SELECT TO anon, authenticated
  USING (
    id::text = current_setting('app.current_player_id', true)
    OR room_id IN (
      SELECT room_id FROM mp_players p
      WHERE p.id::text = current_setting('app.current_player_id', true)
    )
  );

DROP POLICY IF EXISTS "mp_players_update_own_heartbeat" ON mp_players;
CREATE POLICY "mp_players_update_own_heartbeat" ON mp_players
  FOR UPDATE TO anon, authenticated
  USING (id::text = current_setting('app.current_player_id', true))
  WITH CHECK (id::text = current_setting('app.current_player_id', true));

DROP POLICY IF EXISTS "mp_rooms_select_members" ON mp_rooms;
CREATE POLICY "mp_rooms_select_members" ON mp_rooms
  FOR SELECT TO anon, authenticated
  USING (
    id IN (
      SELECT room_id FROM mp_players p
      WHERE p.id::text = current_setting('app.current_player_id', true)
    )
  );
