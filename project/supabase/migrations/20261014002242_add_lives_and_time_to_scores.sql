/*
# Add lives_remaining and time_elapsed to scores table

1. Modified Tables
- `scores`
  - Added `lives_remaining` (int, not null, default 0) — hearts left at game end
  - Added `time_elapsed` (numeric, not null, default 0) — total seconds elapsed in the game session (2 decimal precision)

2. Security
- No policy changes. Existing RLS policies still apply.
- The new columns are populated by the same anon insert that already works.

3. Ordering logic (enforced in application queries, not DB constraints):
- Primary: score DESC (most correct answers)
- Secondary: lives_remaining DESC (more lives left = better)
- Tertiary: time_elapsed ASC (less time = better)
*/

ALTER TABLE scores
  ADD COLUMN IF NOT EXISTS lives_remaining int NOT NULL DEFAULT 0 CHECK (lives_remaining >= 0 AND lives_remaining <= 3),
  ADD COLUMN IF NOT EXISTS time_elapsed numeric NOT NULL DEFAULT 0 CHECK (time_elapsed >= 0);
