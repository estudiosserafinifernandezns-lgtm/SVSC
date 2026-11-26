import { useState, useEffect, useCallback, useRef } from 'react';
import type { Person } from '@/types';
import { quotes } from '@/data/quotes';
import { people } from '@/data/people';
import { supabase } from '@/lib/supabase';
import {
  getState,
  submitAnswer,
  beginPlay,
  type MpSession,
  type MpState,
  type MpPlayer,
} from '@/lib/multiplayer';
import { PixelHeart } from '@/components/PixelHeart';
import { QuoteCard } from '@/components/QuoteCard';
import { PersonCard } from '@/components/PersonCard';
import { Header } from '@/components/Header';
import { MAX_LIVES } from '@/lib/game';
import { Loader2, Wifi, Heart, Trophy, Clock, AlertCircle } from 'lucide-react';

interface MultiplayerGameProps {
  session: MpSession;
  onGameEnd: (state: MpState) => void;
  onLeave: () => void;
}

interface Round {
  quoteId: number;
  quoteText: string;
  isFictional?: boolean;
  leftPerson: Person;
  rightPerson: Person;
  correctSide: 'left' | 'right';
}

interface QuoteIndexMap {
  [quoteId: number]: { author_name: string; decoy_name: string; correct_side: 'left' | 'right' };
}

function findPersonByName(name: string): Person {
  const found = Object.values(people).find((p) => p.name === name);
  if (found) return found;
  // Fallback: search quotes for the author/decoy with this name.
  for (const q of quotes) {
    if (q.author.name === name) return q.author;
    if (q.decoy.name === name) return q.decoy;
  }
  // Last resort: return a generic placeholder.
  return { name, category: 'streamers', profession: '', imageUrl: '' };
}

function buildRound(
  quoteId: number,
  indexEntry: { author_name: string; decoy_name: string; correct_side: 'left' | 'right' }
): Round {
  const quote = quotes.find((q) => q.id === quoteId);
  const author = findPersonByName(indexEntry.author_name);
  const decoy = findPersonByName(indexEntry.decoy_name);
  const correctSide = indexEntry.correct_side;
  const leftPerson = correctSide === 'left' ? author : decoy;
  const rightPerson = correctSide === 'left' ? decoy : author;
  return {
    quoteId,
    quoteText: quote?.text ?? '',
    isFictional: quote?.isFictional,
    leftPerson,
    rightPerson,
    correctSide,
  };
}

export function MultiplayerGame({ session, onGameEnd, onLeave }: MultiplayerGameProps) {
  const [state, setState] = useState<MpState | null>(null);
  const [quoteIndex, setQuoteIndex] = useState<QuoteIndexMap>({});
  const [round, setRound] = useState<Round | null>(null);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'revealing'>('idle');
  const [transitionKey, setTransitionKey] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [myFinished, setMyFinished] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const currentQuestionIdx = useRef(0);

  // Load initial state + quote index.
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const s = await getState(session.playerId);
        if (!mounted) return;
        setState(s);
        setMyFinished(s.me.status !== 'playing');

        // Fetch the quote index for this room from mp_quote_index.
        const { data: idxRows } = await supabase
          .from('mp_quote_index')
          .select('quote_id, author_name, decoy_name, correct_side')
          .in('quote_id', s.room.quote_ids ?? []);
        if (!mounted) return;
        const idxMap: QuoteIndexMap = {};
        for (const r of idxRows ?? []) {
          idxMap[r.quote_id] = {
            author_name: r.author_name,
            decoy_name: r.decoy_name,
            correct_side: r.correct_side as 'left' | 'right',
          };
        }
        setQuoteIndex(idxMap);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Error al cargar la partida.');
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [session.playerId]);

  // Realtime subscription for opponent state updates.
  useEffect(() => {
    if (!state) return;
    const channel = supabase
      .channel(`mpgame-${state.room.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mp_players',
          filter: `room_id=eq.${state.room.id}`,
        },
        () => {
          // Reload state on any player change.
          getState(session.playerId).then((s) => {
            setState(s);
            if (s.me.status !== 'playing' && !myFinished) {
              setMyFinished(true);
            }
            // If both players finished, trigger result.
            const bothDone =
              s.me.status !== 'playing' &&
              s.opponent !== null &&
              s.opponent.status !== 'playing';
            if (bothDone) {
              onGameEnd(s);
            }
          }).catch(() => {});
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mp_rooms',
          filter: `id=eq.${state.room.id}`,
        },
        () => {
          getState(session.playerId).then((s) => {
            setState(s);
          }).catch(() => {});
        }
      )
      .subscribe();
    channelRef.current = channel;
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [state?.room.id, session.playerId, myFinished, onGameEnd]);

  // Load the first round once we have the quote index and are playing.
  const loadRound = useCallback(
    (idx: number) => {
      if (!state) return;
      const quoteIds = state.room.quote_ids ?? [];
      if (idx >= quoteIds.length) {
        // Answered all questions — wait for opponent.
        setMyFinished(true);
        setRound(null);
        return;
      }
      const qid = quoteIds[idx];
      const entry = quoteIndex[qid];
      if (!entry) return;
      const r = buildRound(qid, entry);
      setRound(r);
      setSelectedSide(null);
      setFeedback('idle');
      setTransitionKey((k) => k + 1);
    },
    [state, quoteIndex]
  );

  useEffect(() => {
    if (state && state.me.status === 'playing' && !myFinished && Object.keys(quoteIndex).length > 0 && !round) {
      loadRound(currentQuestionIdx.current);
    }
  }, [state, quoteIndex, myFinished, round, loadRound]);

  // When the room transitions countdown→playing, call beginPlay once.
  useEffect(() => {
    if (!state) return;
    if (state.room.status === 'countdown') {
      const t = setTimeout(() => {
        beginPlay(session.playerId).catch(() => {});
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [state?.room.status, session.playerId]);

  const handleSelect = async (side: 'left' | 'right') => {
    if (feedback !== 'idle' || !round || submitting || myFinished) return;

    setSelectedSide(side);
    setFeedback('revealing');
    setSubmitting(true);

    try {
      const result = await submitAnswer(session.playerId, round.quoteId, side);
      if (result.error) {
        setError(result.error);
        setFeedback('idle');
        setSelectedSide(null);
        return;
      }

      // Refresh state to get updated score/lives.
      const freshState = await getState(session.playerId);
      setState(freshState);

      if (result.finished) {
        setMyFinished(true);
        setSubmitting(false);
        // Check if opponent also finished.
        if (
          freshState.opponent &&
          freshState.opponent.status !== 'playing'
        ) {
          onGameEnd(freshState);
        }
        return;
      }

      // Advance to next question after feedback delay.
      setTimeout(() => {
        currentQuestionIdx.current += 1;
        loadRound(currentQuestionIdx.current);
        setSubmitting(false);
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar respuesta.');
      setFeedback('idle');
      setSelectedSide(null);
      setSubmitting(false);
    }
  };

  // Countdown phase.
  if (state && state.room.status === 'countdown') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] scanlines px-4">
        <CountdownView />
      </div>
    );
  }

  // Waiting for opponent to finish (I finished, opponent still playing).
  if (state && myFinished && state.opponent && state.opponent.status === 'playing') {
    return <WaitingView me={state.me} opponent={state.opponent} />;
  }

  // Both finished — result screen handles this via onGameEnd, but as a guard:
  if (state && myFinished && state.opponent && state.opponent.status !== 'playing') {
    onGameEnd(state);
  }

  if (error && !state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] scanlines px-4">
        <AlertCircle className="w-10 h-10 text-[var(--color-red)] mb-3" />
        <p className="text-[var(--color-red)] font-pixel text-sm mb-4 text-center">{error}</p>
        <button
          onClick={onLeave}
          className="bg-white text-[var(--color-purple)] font-pixel text-xs font-medium rounded-lg px-4 py-2 border-2 border-[var(--color-purple)]/30"
        >
          Volver al menú
        </button>
      </div>
    );
  }

  if (!state || !round) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-purple)]" />
      </div>
    );
  }

  const getCardState = (side: 'left' | 'right'): 'idle' | 'correct' | 'wrong' | 'disabled' => {
    if (feedback === 'idle') return 'idle';
    if (side === round.correctSide) return 'correct';
    if (side === selectedSide) return 'wrong';
    return 'disabled';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] scanlines">
      <Header
        score={state.me.score}
        streak={0}
        bestStreak={state.me.best_streak}
        lives={state.me.lives}
        startTime={Date.now()}
        onShowLeaderboard={() => {}}
        onMenu={onLeave}
      />

      <div className="flex-1 flex flex-col lg:flex-row max-w-5xl mx-auto w-full px-3 sm:px-4 py-3 gap-3">
        {/* Main game area */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div
            key={`q-${transitionKey}`}
            className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            <QuoteCard text={round.quoteText} isFictional={round.isFictional} />
          </div>

          <div
            key={`p-${transitionKey}`}
            className="animate-in fade-in duration-500 flex-1 relative grid grid-cols-2 gap-3 sm:gap-4 min-h-0 items-stretch"
          >
            <div className="animate-in slide-in-from-left duration-500 h-full">
              <PersonCard
                person={round.leftPerson}
                side="left"
                state={getCardState('left')}
                onClick={() => handleSelect('left')}
                disabled={feedback !== 'idle' || submitting}
              />
            </div>
            <div className="animate-in slide-in-from-right duration-500 h-full">
              <PersonCard
                person={round.rightPerson}
                side="right"
                state={getCardState('right')}
                onClick={() => handleSelect('right')}
                disabled={feedback !== 'idle' || submitting}
              />
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[var(--color-yellow)] border-2 border-[var(--color-ink)] rounded-full shadow-arcade-sm vs-pulse">
                <span className="font-display text-xs sm:text-sm text-[var(--color-ink)]">VS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Opponent panel — desktop sidebar */}
        <div className="hidden lg:flex flex-shrink-0 w-56">
          <OpponentPanel opponent={state.opponent} />
        </div>

        {/* Opponent panel — mobile bottom bar */}
        <div className="lg:hidden flex-shrink-0">
          <OpponentBar opponent={state.opponent} />
        </div>
      </div>
    </div>
  );
}

function CountdownView() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count <= 0) return;
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div className="text-center animate-in fade-in zoom-in duration-500">
      <p className="font-pixel text-sm text-gray-500 uppercase tracking-widest mb-4">Comenzando...</p>
      <div className="font-display text-7xl sm:text-8xl text-[var(--color-red)] animate-in zoom-in duration-300" key={count} style={{ textShadow: '4px 4px 0 var(--color-purple-dark)' }}>
        {count > 0 ? count : '¡YA!'}
      </div>
    </div>
  );
}

function WaitingView({ me, opponent }: { me: MpPlayer; opponent: MpPlayer }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] scanlines px-4 py-8">
      <div className="w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl text-[var(--color-ink)] mb-1" style={{ textShadow: '2px 2px 0 var(--color-purple-dark)' }}>
            ¡PARTIDA TERMINADA!
          </h2>
          <p className="text-[var(--color-purple)] text-sm font-pixel">
            Terminaste tu recorrido. Tu rival todavía sigue jugando.
          </p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-pixel text-gray-500 uppercase">Tu puntuación</span>
            <span className="font-display text-xl text-[var(--color-ink)] tabular-nums">{me.score}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-pixel text-gray-500 uppercase">Tus vidas</span>
            <div className="flex gap-0.5">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <PixelHeart key={i} filled={i < me.lives} size={14} />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-[var(--color-purple)]/30 rounded-lg p-4">
          <p className="text-xs font-pixel text-gray-500 uppercase mb-2 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-green-500" />
            Rival: {opponent.nickname}
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Puntuación</span>
            <span className="font-display text-lg text-[var(--color-purple)] tabular-nums">{opponent.score}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">Vidas</span>
            <div className="flex gap-0.5">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <PixelHeart key={i} filled={i < opponent.lives} size={12} />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Estado</span>
            <span className="text-xs font-pixel text-green-600 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              JUGANDO
            </span>
          </div>
        </div>

        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-purple)] mx-auto" />
          <p className="text-xs text-gray-400 font-pixel mt-2 animate-blink">Esperando al rival...</p>
        </div>
      </div>
    </div>
  );
}

function OpponentPanel({ opponent }: { opponent: MpPlayer | null }) {
  if (!opponent) return null;
  return (
    <div className="w-full bg-white border-2 border-[var(--color-purple)]/30 rounded-lg p-4 h-fit sticky top-4">
      <p className="text-[10px] font-pixel text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Wifi className="w-3 h-3 text-green-500" />
        Rival en vivo
      </p>
      <p className="font-display text-lg text-[var(--color-purple)] mb-3 truncate">{opponent.nickname}</p>

      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-pixel text-gray-400 uppercase mb-1 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Puntuación
          </p>
          <p className="font-display text-2xl text-[var(--color-ink)] tabular-nums">{opponent.score}</p>
        </div>

        <div>
          <p className="text-[10px] font-pixel text-gray-400 uppercase mb-1 flex items-center gap-1">
            <Heart className="w-3 h-3" /> Vidas
          </p>
          <div className="flex gap-0.5">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <PixelHeart key={i} filled={i < opponent.lives} size={14} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-pixel text-gray-400 uppercase mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Estado
          </p>
          <p className={`text-xs font-pixel flex items-center gap-1 ${
            opponent.status === 'playing' ? 'text-green-600' :
            opponent.status === 'won' || opponent.status === 'lost' ? 'text-[var(--color-yellow-dark)]' :
            'text-gray-400'
          }`}>
            {opponent.status === 'playing' && <><Loader2 className="w-3 h-3 animate-spin" /> JUGANDO</>}
            {opponent.status === 'won' && 'COMPLETÓ'}
            {opponent.status === 'lost' && 'PERDIÓ'}
            {opponent.status === 'disconnected' && 'DESCONECTADO'}
            {opponent.status === 'left' && 'ABANDONÓ'}
            {opponent.status === 'lobby' && 'LISTO'}
          </p>
        </div>
      </div>
    </div>
  );
}

function OpponentBar({ opponent }: { opponent: MpPlayer | null }) {
  if (!opponent) return null;
  return (
    <div className="bg-white border-2 border-[var(--color-purple)]/30 rounded-lg px-3 py-2 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <Wifi className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
        <span className="font-pixel text-xs text-[var(--color-purple)] truncate">{opponent.nickname}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="flex items-center gap-1 text-xs font-pixel">
          <Trophy className="w-3 h-3 text-[var(--color-yellow-dark)]" />
          <span className="tabular-nums text-[var(--color-ink)]">{opponent.score}</span>
        </span>
        <span className="flex gap-0.5">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <PixelHeart key={i} filled={i < opponent.lives} size={10} />
          ))}
        </span>
      </div>
    </div>
  );
}
