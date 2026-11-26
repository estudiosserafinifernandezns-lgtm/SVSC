/*
# Create leaderboard table for ¿Quién Dijo La Frase?

1. New Tables
- `scores`
  - `id` (uuid, primary key)
  - `nickname` (text, not null) — player's chosen alias
  - `score` (int, not null) — final score for a game session
  - `best_streak` (int, not null) — best streak achieved in that session
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `scores`.
- Allow anon + authenticated to read all scores (public leaderboard).
- Allow anon + authenticated to insert new scores (no sign-in required).
- No update or delete policies — scores are immutable once submitted.
*/

CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL CHECK (length(trim(nickname)) > 0 AND length(nickname) <= 20),
  score int NOT NULL CHECK (score >= 0),
  best_streak int NOT NULL CHECK (best_streak >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_scores" ON scores;
CREATE POLICY "anon_select_scores" ON scores FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scores" ON scores;
CREATE POLICY "anon_insert_scores" ON scores FOR INSERT
TO anon, authenticated WITH CHECK (true);
