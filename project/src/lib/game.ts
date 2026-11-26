import type { Quote, GameState } from '@/types';
import { quotes } from '@/data/quotes';

export const MAX_LIVES = 3;

let gameCounter = 0;

export function getInitialGameState(): GameState {
  gameCounter += 1;
  return {
    score: 0,
    streak: 0,
    bestStreak: 0,
    lives: MAX_LIVES,
    startTime: Date.now(),
    gameId: gameCounter,
    usedQuoteIds: [],
    lastPersons: [],
  };
}

export function getNickname(): string {
  return localStorage.getItem('qdlf_nickname') || '';
}

export function setNickname(name: string): void {
  localStorage.setItem('qdlf_nickname', name.trim());
}

export function getBestScore(): number {
  const raw = localStorage.getItem('qdlf_best_score');
  return raw ? parseInt(raw, 10) : 0;
}

export function setBestScore(score: number): void {
  const current = getBestScore();
  if (score > current) {
    localStorage.setItem('qdlf_best_score', String(score));
  }
}

export function getElapsedTime(startTime: number): number {
  return Math.round((Date.now() - startTime) / 10) / 100;
}

export function formatTime(seconds: number): string {
  return seconds.toFixed(2);
}

interface RoundData {
  quote: Quote;
  leftPerson: typeof quotes[0]['author'];
  rightPerson: typeof quotes[0]['author'];
  correctSide: 'left' | 'right';
}

export function pickRound(state: GameState): RoundData | null {
  const available = quotes.filter((q) => !state.usedQuoteIds.includes(q.id));
  if (available.length === 0) return null;

  let candidates = available.filter(
    (q) => !state.lastPersons.includes(q.author.name)
  );
  if (candidates.length === 0) candidates = available;

  const quote = candidates[Math.floor(Math.random() * candidates.length)];

  const correctSide: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right';
  const leftPerson = correctSide === 'left' ? quote.author : quote.decoy;
  const rightPerson = correctSide === 'left' ? quote.decoy : quote.author;

  return { quote, leftPerson, rightPerson, correctSide };
}

export function getFinalMessage(score: number): string {
  if (score === 0) return '¡Buen intento! La próxima vez será.';
  if (score >= 15) return '¡Eres una enciclopedia andante!';
  if (score >= 10) return '¡Impresionante! Sabes mucho.';
  if (score >= 7) return '¡Muy bien! Tienes buen oído.';
  if (score >= 4) return 'Nada mal. Sigues mejorando.';
  if (score >= 2) return 'Vas agarrando el truco.';
  return '¡A seguir practicando!';
}

export function getShareText(score: number, streak: number, lives: number, time: number): string {
  return `¡Jugué STREAMER VS CIENTÍFICO y conseguí ${score} puntos, ${lives} vidas restantes en ${formatTime(time)}s! ¿Puedes superarme?`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
