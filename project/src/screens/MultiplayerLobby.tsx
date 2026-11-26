import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Copy, Check, Wifi, WifiOff, Loader2, LogOut, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  getState,
  leaveRoom,
  heartbeat,
  startRoom,
  beginPlay,
  buildInviteLink,
  type MpSession,
  type MpState,
} from '@/lib/multiplayer';
import { generateMultiplayerSequence } from '@/lib/mp-questions';
import { copyToClipboard } from '@/lib/game';

interface MultiplayerLobbyProps {
  session: MpSession;
  onLeave: () => void;
  onGameStart: () => void;
}

export function MultiplayerLobby({ session, onLeave, onGameStart }: MultiplayerLobbyProps) {
  const [state, setState] = useState<MpState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState('');
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const startedRef = useRef(false);

  const inviteLink = buildInviteLink(session.code);
  const isPublic = session.mode === 'public';

  // Initial state load + Realtime subscription.
  useEffect(() => {
    let mounted = true;

    const loadState = async () => {
      try {
        const s = await getState(session.playerId);
        if (!mounted) return;
        setState(s);
        setLoading(false);
        if (s.room.status === 'abandoned') {
          setError('La sala fue abandonada.');
        }
        // If the room already moved to countdown/playing, transition to game.
        if ((s.room.status === 'countdown' || s.room.status === 'playing') && !startedRef.current) {
          startedRef.current = true;
          onGameStart();
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'No se pudo cargar la sala.');
        setLoading(false);
      }
    };

    loadState();

    const channel = supabase
      .channel(`lobby-${session.roomId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mp_players', filter: `room_id=eq.${session.roomId}` },
        () => loadState()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'mp_rooms', filter: `id=eq.${session.roomId}` },
        () => loadState()
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [session.playerId, session.roomId, onGameStart]);

  // Heartbeat every 5 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      heartbeat(session.playerId).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [session.playerId]);

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(inviteLink);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleLeave = async () => {
    setLeaving(true);
    try {
      await leaveRoom(session.playerId);
    } catch {
      // ignore
    }
    onLeave();
  };

  // Host starts the game when both players are present.
  const handleStartGame = async () => {
    if (session.slot !== 1 || starting) return;
    setStarting(true);
    setStartError('');
    try {
      const { quoteIds, index } = generateMultiplayerSequence(session.code);
      const result = await startRoom(session.playerId, quoteIds, index);
      if (result.error) {
        setStartError(result.error);
        setStarting(false);
        return;
      }
      // beginPlay is called by the game screen after the countdown.
      // The Realtime listener will detect the room status change and
      // call onGameStart for both players.
    } catch (err) {
      setStartError(err instanceof Error ? err.message : 'No se pudo iniciar la partida.');
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] scanlines">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-purple)]" />
      </div>
    );
  }

  if (error && !state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] scanlines px-4">
        <p className="text-[var(--color-red)] font-pixel text-sm mb-4 text-center">{error}</p>
        <button
          onClick={onLeave}
          className="bg-white hover:bg-gray-50 text-[var(--color-purple)] font-pixel text-xs font-medium rounded-lg px-4 py-2 border-2 border-[var(--color-purple)]/30"
        >
          Volver al menú
        </button>
      </div>
    );
  }

  const me = state?.me;
  const opponent = state?.opponent;
  const roomStatus = state?.room.status ?? 'waiting';
  const bothReady = me && opponent && me.status === 'lobby' && opponent.status === 'lobby';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] scanlines">
      <div className="sticky top-0 z-30 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b-2 border-[var(--color-ink)]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleLeave}
            disabled={leaving}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[var(--color-red)] transition-colors disabled:opacity-50"
          >
            {leaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowLeft className="w-5 h-5" />}
            <span className="text-sm font-pixel">Salir</span>
          </button>
          <h2 className="text-base sm:text-lg font-display text-[var(--color-ink)] flex items-center gap-2 ml-auto">
            {isPublic ? (
              <>
                <Search className="w-5 h-5 text-[var(--color-purple)]" />
                PARTIDA PÚBLICA
              </>
            ) : (
              <>
                <Wifi className="w-5 h-5 text-green-500" />
                SALA PRIVADA
              </>
            )}
          </h2>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full px-4 py-8">
        {/* Room status banner */}
        {roomStatus === 'abandoned' && (
          <div className="mb-4 bg-red-50 border-2 border-[var(--color-red)]/40 rounded-lg px-4 py-3 text-center">
            <p className="text-xs text-[var(--color-red-dark)] font-pixel">
              <WifiOff className="w-4 h-4 inline mr-1" />
              La sala fue abandonada.
            </p>
          </div>
        )}

        {/* Searching / waiting title for public */}
        {isPublic && !opponent && (
          <div className="text-center mb-5 animate-in fade-in duration-500">
            <Search className="w-8 h-8 text-[var(--color-purple)] mx-auto mb-2 animate-pulse" />
            <h1 className="font-display text-xl text-[var(--color-ink)] mb-1" style={{ textShadow: '2px 2px 0 var(--color-purple-dark)' }}>
              BUSCANDO RIVAL...
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              El próximo rival podría estar entrando ahora mismo.
            </p>
          </div>
        )}

        {/* VS lobby display */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-[10px] font-pixel text-gray-400 uppercase tracking-wider text-center mb-4">
            {isPublic && !opponent ? 'Cola de búsqueda' : 'Sala de espera'}
          </p>

          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {/* Player 1 */}
            <div className="flex-1 max-w-[40%] text-center">
              <div
                className={`aspect-square rounded-md border-2 flex items-center justify-center mb-2 transition-colors ${
                  me?.slot === 1
                    ? 'bg-[var(--color-red)]/10 border-[var(--color-red)]'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <span className="font-display text-2xl sm:text-3xl text-[var(--color-ink)] text-center px-2 truncate">
                  {me?.slot === 1 ? me.nickname : opponent?.slot === 1 ? opponent.nickname : '?'}
                </span>
              </div>
              <p className="text-xs font-bold text-gray-700 truncate">
                {me?.slot === 1 ? me.nickname : opponent?.slot === 1 ? opponent.nickname : 'Jugador 1'}
              </p>
              <p className="text-[10px] font-pixel text-[var(--color-red)] mt-0.5">ANFITRIÓN</p>
            </div>

            {/* VS */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--color-yellow)] border-2 border-[var(--color-ink)] flex items-center justify-center shadow-arcade-sm vs-pulse">
                <span className="font-display text-sm sm:text-base text-[var(--color-ink)]">VS</span>
              </div>
            </div>

            {/* Player 2 */}
            <div className="flex-1 max-w-[40%] text-center">
              <div
                className={`aspect-square rounded-2xl border-2 flex items-center justify-center mb-2 transition-colors ${
                  me?.slot === 2
                    ? 'bg-[var(--color-purple)]/10 border-[var(--color-purple)]'
                    : opponent?.slot === 2
                    ? 'bg-[var(--color-purple)]/10 border-[var(--color-purple)]'
                    : 'bg-gray-50 border-dashed border-gray-300'
                }`}
              >
                {opponent && me?.slot !== opponent.slot ? (
                  <span className="font-display text-2xl sm:text-3xl text-[var(--color-purple)] text-center px-2 truncate">
                    {opponent.nickname}
                  </span>
                ) : me?.slot === 2 ? (
                  <span className="font-display text-2xl sm:text-3xl text-[var(--color-purple)] text-center px-2 truncate">
                    {me.nickname}
                  </span>
                ) : (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                )}
              </div>
              <p className="text-xs font-bold text-gray-700 truncate">
                {opponent && me?.slot !== opponent.slot
                  ? opponent.nickname
                  : me?.slot === 2
                  ? me.nickname
                  : isPublic
                  ? 'Esperando oponente...'
                  : 'Esperando rival...'}
              </p>
              <p className="text-[10px] font-pixel text-gray-400 mt-0.5">RETADOR</p>
            </div>
          </div>
        </div>

        {/* Private invite link — only host sees, with COPIAR LINK button */}
        {!isPublic && session.mode === 'private-host' && (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-5 mb-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <p className="text-[10px] font-pixel text-gray-400 uppercase tracking-wider mb-2 text-center">
              Código de invitación
            </p>
            <div className="flex items-center justify-center mb-4">
              <span className="font-display text-2xl tracking-[0.3em] text-[var(--color-ink)] bg-[var(--color-yellow)]/20 border-2 border-[var(--color-yellow)]/50 rounded-lg px-6 py-2">
                {session.code}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2 mb-3">
              <input
                type="text"
                readOnly
                value={inviteLink}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 bg-transparent text-xs text-gray-600 outline-none font-mono"
              />
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-purple)] hover:bg-[var(--color-purple-dark)] text-white font-pixel text-sm font-bold rounded-lg px-4 py-3 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-arcade-sm border-2 border-[var(--color-ink)]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-300" />
                  ¡LINK COPIADO!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  COPIAR LINK DE INVITACIÓN
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-400 mt-3 leading-relaxed text-center">
              Mandá este enlace a tu rival. Cuando entre, aparecerá acá automáticamente.
            </p>
          </div>
        )}

        {/* Start game button — host only, when both ready */}
        {bothReady && session.slot === 1 && (
          <button
            onClick={handleStartGame}
            disabled={starting}
            className="w-full flex items-center justify-center gap-2 bg-[var(--color-red)] hover:bg-[var(--color-red-dark)] text-white font-display text-lg rounded-lg px-6 py-3.5 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-arcade border-2 border-[var(--color-ink)] disabled:opacity-60 mb-4 animate-in fade-in zoom-in duration-500"
          >
            {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wifi className="w-5 h-5" />}
            COMENZAR PARTIDA
          </button>
        )}

        {/* Guest waiting for host to start */}
        {bothReady && session.slot === 2 && (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-5 text-center mb-4 animate-in fade-in duration-500">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--color-purple)] mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              ¡Rival conectado! Esperando a que el anfitrión comience...
            </p>
          </div>
        )}

        {startError && (
          <div className="mb-4 bg-red-50 border-2 border-[var(--color-red)]/40 rounded-lg px-4 py-3 text-center">
            <p className="text-xs text-[var(--color-red-dark)] font-pixel">{startError}</p>
          </div>
        )}

        {/* Connection indicator */}
        <div className="flex items-center justify-center gap-2 text-xs font-pixel text-gray-400 mt-4">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Conectado en tiempo real
        </div>

        {/* Leave / cancel button */}
        <button
          onClick={handleLeave}
          disabled={leaving}
          className="w-full mt-6 flex items-center justify-center gap-2 text-gray-400 hover:text-[var(--color-red)] font-pixel text-xs font-medium rounded-lg px-4 py-2.5 border-2 border-gray-200 hover:border-[var(--color-red)]/30 transition-colors disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          {isPublic && !opponent ? 'CANCELAR BÚSQUEDA' : 'ABANDONAR SALA'}
        </button>
      </div>
    </div>
  );
}
