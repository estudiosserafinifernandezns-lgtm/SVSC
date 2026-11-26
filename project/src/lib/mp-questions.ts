import { quotes } from '@/data/quotes';
import type { QuoteIndexEntry } from '@/lib/multiplayer';

// Deterministic question sequence for a multiplayer room.
// The host generates this and sends it to mp_start_room, which stores it
// in mp_quote_index. Both players then read the same sequence.
//
// We pick a shuffled subset of the quote bank. To keep games reasonable in
// length we cap at 15 questions. Each entry records which side the correct
// author is on for that question, so the server can validate answers
// without trusting the client.

const MAX_QUESTIONS = 15;

function shuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    // Simple LCG for deterministic shuffle.
    s = (s * 1664525 + 1013904223) % 4294967296;
    const j = Math.floor((s / 4294967296) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateMultiplayerSequence(roomCode: string): {
  quoteIds: number[];
  index: QuoteIndexEntry[];
} {
  // Seed from the room code so both players would compute the same sequence
  // if needed (the authoritative copy comes from the server's
  // mp_quote_index, but the host needs to generate it first).
  let seed = 0;
  for (let i = 0; i < roomCode.length; i++) {
    seed = (seed * 31 + roomCode.charCodeAt(i)) % 4294967296;
  }
  if (seed === 0) seed = 1;

  const shuffled = shuffle(quotes, seed);
  const selected = shuffled.slice(0, Math.min(MAX_QUESTIONS, shuffled.length));

  const quoteIds = selected.map((q) => q.id);
  const index: QuoteIndexEntry[] = selected.map((q, i) => {
    // Alternate sides deterministically — no client trust needed because
    // the server stores correct_side and validates every answer.
    const correctSide: 'left' | 'right' = ((i + seed) % 2 === 0) ? 'left' : 'right';
    return {
      quote_id: q.id,
      author_name: q.author.name,
      decoy_name: q.decoy.name,
      correct_side: correctSide,
    };
  });

  return { quoteIds, index };
}
