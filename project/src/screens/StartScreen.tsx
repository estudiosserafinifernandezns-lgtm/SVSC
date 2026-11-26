import { useState, useEffect } from 'react';
import { Play, Trophy, Heart, ChevronRight, Users, HeartHandshake, Swords } from 'lucide-react';
import { getNickname, setNickname, getBestScore, formatTime } from '@/lib/game';
import { getTopScores, type ScoreEntry } from '@/lib/leaderboard';
import { PixelMedal } from '@/components/PixelMedal';
import { PromoCard } from '@/components/PromoCard';

interface StartScreenProps {
  onStart: () => void;
  onShowLeaderboard: () => void;
  onShowCommunity: () => void;
  onShowSupport: () => void;
  onShowMpMenu: () => void;
  mpAutoJoinError?: string;
}

export function StartScreen({ onStart, onShowLeaderboard, onShowCommunity, onShowSupport, onShowMpMenu, mpAutoJoinError }: StartScreenProps) {
  const [nickname, setNicknameInput] = useState(getNickname());
  const bestScore = getBestScore();
  const [top3, setTop3] = useState<ScoreEntry[]>([]);
  const [loadingTop, setLoadingTop] = useState(true);
  const [topError, setTopError] = useState(false);

  useEffect(() => {
    getTopScores(8).then((data) => {
      if (data === null) {
        setTopError(true);
      } else {
        setTop3(data);
      }
      setLoadingTop(false);
    });
  }, []);

  const handleStart = () => {
    const trimmed = nickname.trim();
    if (trimmed) setNickname(trimmed);
    onStart();
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-8 scanlines">
    <div className="flex flex-col items-center w-full max-w-sm">
      {/* === Logo === */}
      <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.15]">
          <span className="text-[var(--color-red)]" style={{ textShadow: '3px 3px 0 var(--color-purple-dark)' }}>
            STREAMER
          </span>
          <span
            className="inline-block mx-1 sm:mx-2 text-[var(--color-yellow)] align-middle vs-pulse"
            style={{ textShadow: '2px 2px 0 var(--color-ink)', fontSize: '0.72em' }}
          >
            VS
          </span>
          <span className="text-[var(--color-purple-light)]" style={{ textShadow: '3px 3px 0 var(--color-red-dark)' }}>
            CIENTÍFICO
          </span>
        </h1>
      </div>

      {/* === Subtitle === */}
      <p className="text-gray-500 text-xs sm:text-sm max-w-xs mx-auto text-center mb-6 animate-in fade-in duration-700 delay-150 leading-relaxed">
        Una frase. Tres vidas.
        <br />
      
      </p>

      {/* === Nickname + Play === */}
      <div className="w-full max-w-sm space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
        <div>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNicknameInput(e.target.value.slice(0, 20))}
            placeholder="Tu apodo (opcional)"
            className="w-full bg-white border-2 border-gray-200 focus:border-[var(--color-purple)] rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-300 outline-none transition-colors text-sm font-medium"
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
        </div>

        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 bg-[var(--color-red)] hover:bg-[var(--color-red-dark)] text-white font-display text-lg rounded-lg px-6 py-3.5 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-arcade border-2 border-[var(--color-ink)]"
        >
          <Play className="w-5 h-5 fill-current" />
          JUGAR SOLO
        </button>

        <button
          onClick={onShowMpMenu}
          className="w-full flex items-center justify-center gap-2 bg-[var(--color-purple)] hover:bg-[var(--color-purple-dark)] text-white font-display text-lg rounded-lg px-6 py-3.5 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-arcade border-2 border-[var(--color-ink)]"
        >
          <Swords className="w-5 h-5" />
          1 VS 1 ONLINE
        </button>

        {mpAutoJoinError && (
          <div className="bg-red-50 border-2 border-[var(--color-red)]/40 rounded-lg px-4 py-2.5 text-center">
            <p className="text-xs text-[var(--color-red-dark)] font-medium">{mpAutoJoinError}</p>
          </div>
        )}

        {bestScore > 0 && (
          <p className="text-center text-xs text-gray-400 font-pixel">
            Récord: <span className="text-[var(--color-yellow-dark)] font-bold">{bestScore}</span> pts
          </p>
        )}
      </div>

      {/* === Top 3 === */}
      <div className="w-full max-w-sm mt-7 animate-in fade-in duration-1000 delay-300">
        <h2 className="text-xs font-bold font-pixel text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-[var(--color-yellow-dark)]" />
          Top 8
        </h2>

        {loadingTop ? (
          <div className="flex items-center justify-center py-5">
            <p className="text-sm text-gray-400 font-pixel animate-blink">Cargando...</p>
          </div>
        ) : topError ? (
          <div className="text-center py-5 bg-white/60 rounded-lg border-2 border-dashed border-[var(--color-red)]/40">
            <p className="text-xs text-[var(--color-red-dark)] font-pixel">No se pudo cargar la clasificación.</p>
            <p className="text-[11px] text-gray-400 mt-1">Revisá tu conexión e intentalo de nuevo.</p>
          </div>
        ) : top3.length === 0 ? (
          <div className="text-center py-5 bg-white/60 rounded-lg border-2 border-dashed border-gray-200">
            <Trophy className="w-6 h-6 text-gray-300 mx-auto mb-1.5" />
            <p className="text-xs text-gray-400 font-pixel">Sin registros aún. ¡Sé el primero!</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {top3.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center gap-3 bg-white border-2 rounded-lg px-3 py-2 transition-colors ${
                  index === 0 ? 'border-[var(--color-yellow)] shadow-arcade-sm' :
                  index === 1 ? 'border-gray-300' :
                  'border-[#cd7f32]/40'
                }`}
              >
                <div className="flex items-center justify-center w-7 flex-shrink-0">
                  {index < 3 ? (
                    <PixelMedal rank={(index + 1) as 1 | 2 | 3} size={22} />
                  ) : (
                    <span className="text-gray-400 font-bold text-sm tabular-nums font-pixel">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{entry.nickname}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-base font-extrabold text-[var(--color-yellow-dark)] tabular-nums font-pixel">{entry.score}</span>
                  <span className="flex items-center gap-0.5">
                    <Heart className="w-3 h-3 text-[var(--color-red)] fill-current" />
                    <span className="text-xs font-bold text-[var(--color-red)] tabular-nums">{entry.lives_remaining}</span>
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-purple)] tabular-nums">
                    {formatTime(Number(entry.time_elapsed))}s
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onShowLeaderboard}
          className="w-full mt-3 flex items-center justify-center gap-1.5 text-[var(--color-purple)] hover:text-[var(--color-purple-light)] font-pixel text-xs font-medium rounded-lg px-4 py-2 transition-colors"
        >
          Ver clasificación completa
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* === Community + Support === */}
      <div className="w-full max-w-sm mt-8 grid grid-cols-1 gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
        <button
          onClick={onShowCommunity}
          className="w-full flex items-center gap-3 bg-white border-2 border-[var(--color-purple)]/30 hover:border-[var(--color-purple)] rounded-lg px-4 py-3 transition-all hover:shadow-arcade-sm text-left group"
        >
          <div className="w-9 h-9 rounded-md bg-[var(--color-purple)]/10 border border-[var(--color-purple)]/30 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-[var(--color-purple)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold font-pixel text-[var(--color-ink)]">La comunidad también juega</p>
            <p className="text-[11px] text-gray-400 leading-tight">Sugerí un nuevo versus</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--color-purple)] transition-colors flex-shrink-0" />
        </button>

        <button
          onClick={onShowSupport}
          className="w-full flex items-center gap-3 bg-white border-2 border-[var(--color-red)]/25 hover:border-[var(--color-red)] rounded-lg px-4 py-3 transition-all hover:shadow-arcade-sm text-left group"
        >
          <div className="w-9 h-9 rounded-md bg-[var(--color-red)]/8 border border-[var(--color-red)]/25 flex items-center justify-center flex-shrink-0">
            <HeartHandshake className="w-5 h-5 text-[var(--color-red)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold font-pixel text-[var(--color-ink)]">Ayudá a mantener el juego vivo</p>
            <p className="text-[11px] text-gray-400 leading-tight">Donación voluntaria</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[var(--color-red)] transition-colors flex-shrink-0" />
        </button>
      </div>

      {/* === Footer === */}
      <footer className="mt-10 mb-4 text-center animate-in fade-in duration-1000 delay-300">
        <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs mx-auto">
          Juego online gratis de trivia: streamers, científicos y frases célebres.
        </p>
      </footer>
    </div>

    <PromoCard />
    </div>
  );
}
