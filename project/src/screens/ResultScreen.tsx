import { useState, useEffect } from 'react';
import type { GameState, Quote } from '@/types';
import { Avatar } from '@/components/Avatar';
import { PixelHeart } from '@/components/PixelHeart';
import { getFinalMessage, getShareText, copyToClipboard, getNickname, getElapsedTime, formatTime } from '@/lib/game';
import { submitScore } from '@/lib/leaderboard';
import { MAX_LIVES } from '@/lib/game';
import { RotateCcw, Home, Share2, Check, Trophy, Clock, ExternalLink, Info } from 'lucide-react';

interface ResultScreenProps {
  state: GameState;
  lastQuote: Quote;
  onPlayAgain: () => void;
  onMenu: () => void;
  onShowLeaderboard: () => void;
}

export function ResultScreen({
  state,
  lastQuote,
  onPlayAgain,
  onMenu,
  onShowLeaderboard,
}: ResultScreenProps) {
  const [copied, setCopied] = useState(false);
  const isAttributionUnconfirmed =
    Boolean(lastQuote.isFictional || lastQuote.context || /atribuid/i.test(lastQuote.source));
  const message = getFinalMessage(state.score);
  const elapsedTime = getElapsedTime(state.startTime);
  const shareText = getShareText(state.score, state.bestStreak, state.lives, elapsedTime);
  const gameUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    const nickname = getNickname();
    submitScore(state.gameId, nickname || 'Anónimo', state.score, state.bestStreak, state.lives, elapsedTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gameId]);

  const handleShare = async () => {
    const fullText = `${shareText} ${gameUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, url: gameUrl });
      } catch {
        // User cancelled
      }
    } else {
      const success = await copyToClipboard(fullText);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[var(--color-bg)] scanlines">
      <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Game Over header */}
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-[var(--color-ink)] mb-1" style={{ textShadow: '2px 2px 0 var(--color-purple-dark)' }}>
            GAME OVER
          </h2>
          <p className="text-[var(--color-purple)] text-sm font-pixel">{message}</p>
        </div>

        {/* Stats — compact arcade bar */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white border-2 border-[var(--color-yellow)] rounded-lg p-3 text-center shadow-arcade-sm">
            <Trophy className="w-5 h-5 text-[var(--color-yellow-dark)] mx-auto mb-1" />
            <p className="text-xl font-pixel font-bold text-[var(--color-ink)] tabular-nums">{state.score}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Puntos</p>
          </div>
          <div className="bg-white border-2 border-[var(--color-red)] rounded-lg p-3 text-center shadow-arcade-sm">
            <div className="flex items-center justify-center gap-0.5 mb-1 min-h-[16px]">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <PixelHeart key={i} filled={i < state.lives} size={12} />
              ))}
            </div>
            <p className="text-xl font-pixel font-bold text-[var(--color-ink)] tabular-nums">{state.lives}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Vidas</p>
          </div>
          <div className="bg-white border-2 border-[var(--color-purple)] rounded-lg p-3 text-center shadow-arcade-sm">
            <Clock className="w-5 h-5 text-[var(--color-purple)] mx-auto mb-1" />
            <p className="text-lg font-pixel font-bold text-[var(--color-ink)] tabular-nums">{formatTime(elapsedTime)}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Segundos</p>
          </div>
        </div>

        {/* Last quote reveal */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 space-y-3">
          <p className="text-[10px] font-pixel text-gray-400 uppercase tracking-wider">La última frase era:</p>
          <p className="text-gray-800 font-semibold text-sm leading-relaxed">&ldquo;{lastQuote.text}&rdquo;</p>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <div className="w-11 h-11 rounded-md overflow-hidden bg-purple-100 flex-shrink-0 border border-gray-200">
              <Avatar person={lastQuote.author} size="md" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-pixel text-gray-400 uppercase tracking-wider">La dijo:</p>
              <p className="text-gray-800 font-bold truncate text-sm font-pixel">{lastQuote.author.name}</p>
              <p className="text-xs text-[var(--color-purple)] truncate">{lastQuote.author.profession}</p>
            </div>
          </div>

          {isAttributionUnconfirmed ? (
            <p className="pt-2 border-t border-gray-100 text-xs text-gray-400 italic">
              Frase atribuida a {lastQuote.author.name}
            </p>
          ) : (
            <div className="pt-2 border-t border-gray-100 space-y-1">
              <div className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-500 leading-relaxed">{lastQuote.source}</p>
              </div>
              {lastQuote.sourceUrl && (
                <a
                  href={lastQuote.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--color-purple)] hover:text-[var(--color-purple-light)] pl-5.5"
                >
                  Ver fuente <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[var(--color-purple)] font-pixel text-xs font-medium rounded-lg px-6 py-2.5 border-2 border-[var(--color-purple)]/25 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                ¡Copiado!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Compartir resultado
              </>
            )}
          </button>

          <button
            onClick={onPlayAgain}
            className="w-full flex items-center justify-center gap-2 bg-[var(--color-red)] hover:bg-[var(--color-red-dark)] text-white font-display text-base rounded-lg px-6 py-3 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-arcade border-2 border-[var(--color-ink)]"
          >
            <RotateCcw className="w-5 h-5" />
            JUGAR DE NUEVO
          </button>

          <div className="flex gap-2">
            <button
              onClick={onShowLeaderboard}
              className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[var(--color-yellow-dark)] font-pixel text-xs font-medium rounded-lg px-4 py-2.5 border-2 border-[var(--color-yellow)]/40 transition-colors"
            >
              <Trophy className="w-4 h-4 text-[var(--color-yellow-dark)]" />
              Ranking
            </button>
            <button
              onClick={onMenu}
              className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[var(--color-purple)] font-pixel text-xs font-medium rounded-lg px-4 py-2.5 border-2 border-[var(--color-purple)]/25 transition-colors"
            >
              <Home className="w-4 h-4" />
              Menú
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
