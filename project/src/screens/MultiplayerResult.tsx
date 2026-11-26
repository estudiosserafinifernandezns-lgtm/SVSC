import { useState, useEffect } from 'react';
import { Trophy, Heart, Clock, RotateCcw, Home, Check, Loader2, X } from 'lucide-react';
import type { MpState, MpPlayer } from '@/lib/multiplayer';
import { computeOutcome } from '@/lib/multiplayer';
import { supabase } from '@/lib/supabase';
import { PixelHeart } from '@/components/PixelHeart';
import { MAX_LIVES } from '@/lib/game';

interface MultiplayerResultProps {
  state: MpState;
  session: { playerId: string; nickname: string };
  onRematch: () => void;
  onMenu: () => void;
}

function formatMs(ms: number): string {
  return (ms / 1000).toFixed(2);
}

export function MultiplayerResult({ state, session, onRematch, onMenu }: MultiplayerResultProps) {
  const { me, opponent } = state;
  const outcome = opponent ? computeOutcome(me, opponent) : 'lost';
  const [rematchRequested, setRematchRequested] = useState(false);
  const [opponentRematch, setOpponentRematch] = useState(false);
  const [rematchError, setRematchError] = useState('');

  // Track rematch requests via Realtime on the room row.
  useEffect(() => {
    if (!opponent) return;
    const channel = supabase
      .channel(`mpresult-${state.room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'mp_rooms',
          filter: `id=eq.${state.room.id}`,
        },
        (payload) => {
          const newRow = payload.new as { rematch_requested_by: string | null };
          if (newRow.rematch_requested_by && newRow.rematch_requested_by !== session.playerId) {
            setOpponentRematch(true);
            // If I already requested, both want rematch → start.
            if (rematchRequested) {
              onRematch();
            }
          }
        }
      )
      .subscribe();

    // Also check the current room state for an existing rematch request.
    supabase
      .from('mp_rooms')
      .select('rematch_requested_by')
      .eq('id', state.room.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.rematch_requested_by && data.rematch_requested_by !== session.playerId) {
          setOpponentRematch(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.room.id, session.playerId, rematchRequested, onRematch, opponent]);

  const handleRematch = async () => {
    setRematchError('');
    try {
      const { error } = await supabase.rpc('mp_request_rematch', {
        p_player_id: session.playerId,
      });
      if (error) throw new Error(error.message);
      setRematchRequested(true);
    } catch (err) {
      setRematchError(err instanceof Error ? err.message : 'No se pudo pedir la revancha.');
    }
  };

  const handleCancelRematch = async () => {
    try {
      await supabase.rpc('mp_cancel_rematch', { p_player_id: session.playerId });
    } catch {
      // ignore
    }
    setRematchRequested(false);
  };

  const headerColor =
    outcome === 'won' ? 'var(--color-yellow-dark)' :
    outcome === 'lost' ? 'var(--color-red)' :
    'var(--color-purple)';

  const headerText =
    outcome === 'won' ? 'VICTORIA' :
    outcome === 'lost' ? 'DERROTA' :
    'EMPATE';

  const headerShadow =
    outcome === 'won' ? 'rgba(202,138,4,0.2)' :
    outcome === 'lost' ? 'rgba(220,38,38,0.2)' :
    'rgba(126,58,242,0.2)';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] scanlines px-4 py-8">
      <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Result header */}
        <div className="text-center">
          <h2
            className="font-display text-3xl sm:text-4xl mb-1"
            style={{ color: headerColor, textShadow: `3px 3px 0 ${headerShadow}` }}
          >
            {headerText}
          </h2>
          {opponent && (
            <p className="text-sm font-pixel text-gray-500">
              {me.nickname} VS {opponent.nickname}
            </p>
          )}
        </div>

        {/* Both players' stats */}
        {opponent && (
          <div className="grid grid-cols-2 gap-3">
            <PlayerStatCard
              player={me}
              isMe
              highlight={outcome === 'won'}
              label="VOS"
            />
            <PlayerStatCard
              player={opponent}
              isMe={false}
              highlight={outcome === 'lost'}
              label="RIVAL"
            />
          </div>
        )}

        {/* Rematch section */}
        <div className="space-y-2">
          {!rematchRequested ? (
            <button
              onClick={handleRematch}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-red)] hover:bg-[var(--color-red-dark)] text-white font-display text-base rounded-lg px-6 py-3 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-arcade border-2 border-[var(--color-ink)]"
            >
              <RotateCcw className="w-5 h-5" />
              REVANCHA
            </button>
          ) : (
            <div className="bg-white border-2 border-[var(--color-purple)]/30 rounded-lg p-4 text-center">
              <p className="text-sm font-pixel text-[var(--color-purple)] mb-3 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {opponentRematch ? '¡Tu rival aceptó! Comenzando...' : 'Esperando a tu rival...'}
              </p>
              <button
                onClick={handleCancelRematch}
                className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[var(--color-red)] font-pixel text-xs"
              >
                <X className="w-3.5 h-3.5" />
                Cancelar revancha
              </button>
            </div>
          )}

          {opponentRematch && !rematchRequested && (
            <div className="bg-white border-2 border-[var(--color-yellow)]/50 rounded-lg p-3 text-center">
              <p className="text-xs font-pixel text-[var(--color-yellow-dark)] mb-2">
                ¡Tu rival quiere la revancha!
              </p>
              <button
                onClick={handleRematch}
                className="w-full flex items-center justify-center gap-2 bg-[var(--color-yellow)] hover:bg-[var(--color-yellow-dark)] text-[var(--color-ink)] font-display text-sm rounded-lg px-4 py-2.5 transition-all border-2 border-[var(--color-ink)]"
              >
                <Check className="w-4 h-4" />
                ACEPTAR REVANCHA
              </button>
            </div>
          )}

          {rematchError && (
            <p className="text-xs text-[var(--color-red)] text-center font-pixel">{rematchError}</p>
          )}

          <button
            onClick={onMenu}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-[var(--color-purple)] font-pixel text-xs font-medium rounded-lg px-4 py-2.5 border-2 border-[var(--color-purple)]/25 transition-colors"
          >
            <Home className="w-4 h-4" />
            VOLVER AL MENÚ
          </button>
        </div>
      </div>
    </div>
  );
}

function PlayerStatCard({
  player,
  isMe,
  highlight,
  label,
}: {
  player: MpPlayer;
  isMe: boolean;
  highlight: boolean;
  label: string;
}) {
  return (
    <div
      className={`bg-white border-2 rounded-lg p-3 text-center ${
        highlight ? 'border-[var(--color-yellow)] shadow-arcade-sm' : 'border-gray-200'
      } ${isMe ? 'bg-[var(--color-red)]/5' : 'bg-[var(--color-purple)]/5'}`}
    >
      <p className={`text-[10px] font-pixel uppercase tracking-wider mb-2 ${
        isMe ? 'text-[var(--color-red)]' : 'text-[var(--color-purple)]'
      }`}>
        {label}
      </p>
      <p className="font-display text-sm text-[var(--color-ink)] truncate mb-3">{player.nickname}</p>

      <div className="space-y-2">
        <div>
          <Trophy className="w-4 h-4 text-[var(--color-yellow-dark)] mx-auto mb-0.5" />
          <p className="font-display text-xl text-[var(--color-ink)] tabular-nums">{player.score}</p>
          <p className="text-[9px] text-gray-400 uppercase">Puntos</p>
        </div>

        <div>
          <div className="flex items-center justify-center gap-0.5 mb-0.5">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <PixelHeart key={i} filled={i < player.lives} size={11} />
            ))}
          </div>
          <p className="text-[9px] text-gray-400 uppercase">Vidas</p>
        </div>

        <div>
          <Clock className="w-3.5 h-3.5 text-gray-400 mx-auto mb-0.5" />
          <p className="text-xs font-pixel text-gray-600 tabular-nums">{formatMs(player.elapsed_ms)}s</p>
          <p className="text-[9px] text-gray-400 uppercase">Tiempo</p>
        </div>
      </div>
    </div>
  );
}
