import { useState } from 'react';
import { ArrowLeft, Swords, Lock, Search, KeyRound, Loader2 } from 'lucide-react';
import { getNickname, setNickname } from '@/lib/game';
import { createRoom, joinRoom, joinPublic, type MpSession } from '@/lib/multiplayer';

interface MultiplayerMenuProps {
  onBack: () => void;
  onSession: (session: MpSession) => void;
  pendingJoinCode?: string | null;
}

export function MultiplayerMenu({ onBack, onSession, pendingJoinCode }: MultiplayerMenuProps) {
  const [nickname, setNicknameInput] = useState(getNickname());
  const [joinCode, setJoinCode] = useState(pendingJoinCode ?? '');
  const [busy, setBusy] = useState<null | 'create' | 'search' | 'join'>(null);
  const [error, setError] = useState('');

  const ensureNickname = (): string | null => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError('Escribí un apodo para jugar online.');
      return null;
    }
    setNickname(trimmed);
    return trimmed;
  };

  const handleCreatePrivate = async () => {
    const nick = ensureNickname();
    if (!nick) return;
    setBusy('create');
    setError('');
    try {
      const res = await createRoom(nick, 'private');
      onSession({
        playerId: res.player_id,
        roomId: res.room_id,
        code: res.code,
        slot: res.slot,
        nickname: nick,
        mode: 'private-host',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la sala.');
    } finally {
      setBusy(null);
    }
  };

  const handleSearchPublic = async () => {
    const nick = ensureNickname();
    if (!nick) return;
    setBusy('search');
    setError('');
    try {
      const res = await joinPublic(nick);
      onSession({
        playerId: res.player_id,
        roomId: res.room_id,
        code: res.code,
        slot: res.slot,
        nickname: nick,
        mode: 'public',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo buscar partida.');
    } finally {
      setBusy(null);
    }
  };

  const handleJoinWithCode = async () => {
    const nick = ensureNickname();
    if (!nick) return;
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      setError('Escribí el código de invitación.');
      return;
    }
    setBusy('join');
    setError('');
    try {
      const res = await joinRoom(code, nick);
      onSession({
        playerId: res.player_id,
        roomId: res.room_id,
        code: res.code,
        slot: res.slot,
        nickname: nick,
        mode: 'private-guest',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo unir a la sala.');
    } finally {
      setBusy(null);
    }
  };

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
            <Swords className="w-5 h-5 text-[var(--color-red)]" />
            1 VS 1 ONLINE
          </h2>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full px-4 py-8">
        {/* Invite banner */}
        {pendingJoinCode && (
          <div className="mb-5 bg-[var(--color-purple)]/10 border-2 border-[var(--color-purple)]/40 rounded-lg px-4 py-3 text-center animate-in fade-in slide-in-from-top-4 duration-500">
            <p className="text-sm font-pixel text-[var(--color-purple)]">
              ¡Te invitaron a una partida!
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Ingresá tu apodo y pulsá ENTRAR para unirte.
            </p>
          </div>
        )}

        <div className="text-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-md bg-[var(--color-red)]/10 border-2 border-[var(--color-red)]/40 flex items-center justify-center">
              <span className="font-display text-xl text-[var(--color-red)]">P1</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--color-yellow)] border-2 border-[var(--color-ink)] flex items-center justify-center shadow-arcade-sm vs-pulse">
              <span className="font-display text-xs text-[var(--color-ink)]">VS</span>
            </div>
            <div className="w-14 h-14 rounded-md bg-[var(--color-purple)]/10 border-2 border-[var(--color-purple)]/40 flex items-center justify-center">
              <span className="font-display text-xl text-[var(--color-purple)]">P2</span>
            </div>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-[var(--color-ink)] mb-1" style={{ textShadow: '2px 2px 0 var(--color-purple-dark)' }}>
            MULTIJUGADOR
          </h1>
          <p className="text-sm text-gray-500">Desafiá a otro jugador en tiempo real.</p>
        </div>

        {/* Nickname */}
        <div className="mb-5 animate-in fade-in duration-500">
          <label className="block text-xs font-bold font-pixel text-gray-500 uppercase tracking-wider mb-1.5">
            Tu apodo
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNicknameInput(e.target.value.slice(0, 20))}
            placeholder="Ej: Nico"
            className="w-full bg-white border-2 border-gray-200 focus:border-[var(--color-purple)] rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-300 outline-none transition-colors text-sm font-medium"
          />
        </div>

        {/* Create private */}
        <button
          onClick={handleCreatePrivate}
          disabled={busy !== null}
          className="w-full flex items-center gap-3 bg-[var(--color-red)] hover:bg-[var(--color-red-dark)] text-white font-pixel text-sm font-bold rounded-lg px-5 py-3.5 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-arcade border-2 border-[var(--color-ink)] disabled:opacity-60 mb-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100"
        >
          {busy === 'create' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
          CREAR PARTIDA PRIVADA
        </button>

        {/* Search public */}
        <button
          onClick={handleSearchPublic}
          disabled={busy !== null}
          className="w-full flex items-center gap-3 bg-[var(--color-purple)] hover:bg-[var(--color-purple-dark)] text-white font-pixel text-sm font-bold rounded-lg px-5 py-3.5 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-arcade border-2 border-[var(--color-ink)] disabled:opacity-60 mb-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200"
        >
          {busy === 'search' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          BUSCAR PARTIDA PÚBLICA
        </button>

        {/* Join with code */}
        <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <label className="block text-xs font-bold font-pixel text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" />
            UNIRSE CON CÓDIGO
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.slice(0, 8).toUpperCase())}
              placeholder="CÓDIGO"
              className="flex-1 bg-white border-2 border-gray-200 focus:border-[var(--color-purple)] rounded-lg px-4 py-2.5 text-gray-800 placeholder:text-gray-300 outline-none transition-colors text-sm font-pixel font-bold uppercase tracking-widest"
            />
            <button
              onClick={handleJoinWithCode}
              disabled={busy !== null}
              className="px-4 bg-white hover:bg-gray-50 text-[var(--color-purple)] font-pixel text-xs font-bold rounded-lg border-2 border-[var(--color-purple)]/30 transition-colors disabled:opacity-60"
            >
              {busy === 'join' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ENTRAR'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border-2 border-[var(--color-red)]/40 rounded-lg px-4 py-3 text-center animate-in fade-in zoom-in duration-300">
            <p className="text-xs text-[var(--color-red-dark)] font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
