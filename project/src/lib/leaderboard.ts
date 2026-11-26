import { supabase } from '@/lib/supabase';

export interface ScoreEntry {
  id: string;
  nickname: string;
  score: number;
  best_streak: number;
  lives_remaining: number;
  time_elapsed: number;
  created_at: string;
}

const submittedGameIds = new Set<number>();

export async function submitScore(
  gameId: number,
  nickname: string,
  score: number,
  bestStreak: number,
  livesRemaining: number,
  timeElapsed: number
): Promise<ScoreEntry | null> {
  if (submittedGameIds.has(gameId)) return null;
  submittedGameIds.add(gameId);

  const { data, error } = await supabase
    .from('scores')
    .insert({
      nickname,
      score,
      best_streak: bestStreak,
      lives_remaining: livesRemaining,
      time_elapsed: timeElapsed,
    })
    .select()
    .single();

  if (error) {
    submittedGameIds.delete(gameId);
    console.error('Error submitting score:', error.message);
    return null;
  }

  return data as ScoreEntry;
}

export async function getTopScores(limit = 10): Promise<ScoreEntry[] | null> {
  const { data, error } = await supabase
    .from('scores')
    .select('id, nickname, score, best_streak, lives_remaining, time_elapsed, created_at')
    .order('score', { ascending: false })
    .order('lives_remaining', { ascending: false })
    .order('time_elapsed', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching scores:', error.message);
    return null;
  }

  return (data as ScoreEntry[]) || [];
}
