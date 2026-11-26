import { Trophy, Flame, Clock } from 'lucide-react';
import { PixelHeart } from './PixelHeart';
import { MAX_LIVES, formatTime, getElapsedTime } from '@/lib/game';

interface HeaderProps {
  score: number;
  streak: number;
  bestStreak: number;
  lives: number;
  startTime: number;
  onShowLeaderboard: () => void;
  onMenu: () => void;
}

export function Header({ score, streak, lives, startTime, onShowLeaderboard, onMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b-2 border-[var(--color-ink)]">
      <div className="max-w-3xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
        {/* Logo button — returns to menu */}
        <button
          onClick={onMenu}
          className="font-display text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-opacity hover:opacity-70"
          title="Volver al menú"
        >
          <span className="text-[var(--color-red)]">S</span>
          <span className="text-[var(--color-yellow)]">VS</span>
          <span className="text-[var(--color-purple-light)]">C</span>
        </button>

        {/* Stats cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Hearts */}
          <div className="flex items-center gap-0.5 bg-[var(--color-red)]/8 rounded-md px-1.5 py-1 border border-[var(--color-red)]/20">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <PixelHeart key={i} filled={i < lives} size={15} />
            ))}
          </div>

          {/* Score */}
          <div className="flex items-center gap-1 bg-[var(--color-yellow)]/12 rounded-md px-2 py-1 border border-[var(--color-yellow)]/30">
            <Trophy className="w-3.5 h-3.5 text-[var(--color-yellow-dark)]" />
            <span className="text-sm font-bold font-pixel text-[var(--color-yellow-dark)] tabular-nums">{score}</span>
          </div>

          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-[var(--color-red)]/10 rounded-md px-2 py-1 border border-[var(--color-red)]/25">
              <Flame className="w-3.5 h-3.5 text-[var(--color-red)]" />
              <span className="text-sm font-bold font-pixel text-[var(--color-red)] tabular-nums">{streak}</span>
            </div>
          )}

          {/* Timer */}
          <div className="hidden sm:flex items-center gap-1 bg-[var(--color-purple)]/8 rounded-md px-2 py-1 border border-[var(--color-purple)]/20">
            <Clock className="w-3.5 h-3.5 text-[var(--color-purple)]" />
            <span className="text-sm font-pixel text-[var(--color-purple)] tabular-nums">{formatTime(getElapsedTime(startTime))}</span>
          </div>

          {/* Leaderboard */}
          <button
            onClick={onShowLeaderboard}
            className="flex items-center gap-1 bg-[var(--color-purple)]/12 hover:bg-[var(--color-purple)]/20 rounded-md px-2 py-1 border border-[var(--color-purple)]/25 transition-colors"
            aria-label="Ver clasificación"
          >
            <Trophy className="w-3.5 h-3.5 text-[var(--color-purple)]" />
            <span className="hidden sm:inline text-xs font-pixel text-[var(--color-purple)]">Ranking</span>
          </button>
        </div>
      </div>
    </header>
  );
}
