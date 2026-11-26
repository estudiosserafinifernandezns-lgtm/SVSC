import { useState, useEffect } from 'react';
import { Trophy, ArrowLeft, Heart } from 'lucide-react';
import { getTopScores, type ScoreEntry } from '@/lib/leaderboard';
import { formatTime } from '@/lib/game';
import { PixelMedal } from '@/components/PixelMedal';

interface LeaderboardScreenProps {
  onBack: () => void;
}

const motivationalQuotes = [
  'El Imperio romano no se construyó en un solo día.',
  'Cada experto fue alguna vez un principiante.',
  'El conocimiento es la única riqueza que crece al compartirla.',
  'No es el más fuerte el que sobrevive, sino el que se adapta al cambio.',
  'La paciencia es amarga, pero sus frutos son dulces.',
  'El que persevera alcanza.',
  'Los errores son la prueba de que estás intentando.',
];

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const motivationalQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  useEffect(() => {
    getTopScores(20).then((data) => {
      if (data === null) {
        setError(true);
      } else {
        setScores(data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] scanlines">
      <div className="sticky top-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b-2 border-[var(--color-ink)]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[var(--color-purple)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-pixel">Volver</span>
          </button>
          <h2 className="text-base sm:text-lg font-display text-[var(--color-ink)] flex items-center gap-2 ml-auto">
            <Trophy className="w-5 h-5 text-[var(--color-yellow-dark)]" />
            CLASIFICACIÓN
          </h2>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="mb-5 text-center">
          <p className="text-xs text-gray-500 mb-1 font-pixel">Debes entrar al Top 20 para aparecer aquí.</p>
          <p className="text-sm text-[var(--color-purple)] italic">{motivationalQuote}</p>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-[2rem_1fr_3rem_2.5rem_4rem] sm:grid-cols-[2.5rem_1fr_4rem_3rem_5rem] gap-2 px-4 py-2 text-[10px] text-gray-400 font-pixel uppercase tracking-wider">
          <span>#</span>
          <span>Jugador</span>
          <span className="text-center">Pts</span>
          <span className="text-center">Vidas</span>
          <span className="text-right">Tiempo</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-400 font-pixel animate-blink">Cargando...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-[var(--color-red-dark)] font-pixel">No se pudo cargar la clasificación.</p>
            <p className="text-gray-400 text-sm mt-1">Revisá tu conexión e intentalo de nuevo.</p>
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-pixel">Aún no hay puntuaciones.</p>
            <p className="text-gray-300 text-sm mt-1">¡Sé el primero en jugar!</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {scores.map((entry, index) => (
              <div
                key={entry.id}
                className={`grid grid-cols-[2rem_1fr_3rem_2.5rem_4rem] sm:grid-cols-[2.5rem_1fr_4rem_3rem_5rem] gap-2 items-center bg-white border-2 rounded-lg px-4 py-3 transition-colors ${
                  index === 0 ? 'border-[var(--color-yellow)] shadow-arcade-sm' :
                  index < 3 ? 'border-[var(--color-yellow)]/40' :
                  'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-center flex-shrink-0">
                  {index < 3 ? (
                    <PixelMedal rank={(index + 1) as 1 | 2 | 3} size={24} />
                  ) : (
                    <span className="text-gray-300 font-bold text-sm tabular-nums font-pixel">{index + 1}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-gray-800 font-bold truncate text-sm sm:text-base">{entry.nickname}</p>
                </div>

                <div className="text-center">
                  <span className="text-lg font-extrabold text-[var(--color-yellow-dark)] tabular-nums font-pixel">{entry.score}</span>
                </div>

                <div className="flex items-center justify-center gap-0.5">
                  <Heart className="w-3 h-3 text-[var(--color-red)] fill-current" />
                  <span className="text-sm font-bold text-[var(--color-red)] tabular-nums">{entry.lives_remaining}</span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-semibold text-[var(--color-purple)] tabular-nums">
                    {formatTime(Number(entry.time_elapsed))}
                  </span>
                  <span className="text-xs text-gray-400 ml-0.5">s</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
