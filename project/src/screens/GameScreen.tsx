import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, Person, Quote } from '@/types';
import { pickRound } from '@/lib/game';
import { Header } from '@/components/Header';
import { PersonCard } from '@/components/PersonCard';
import { QuoteCard } from '@/components/QuoteCard';

interface GameScreenProps {
  state: GameState;
  onUpdateState: (state: GameState) => void;
  onGameOver: (finalState: GameState, lastQuote: Quote) => void;
  onShowLeaderboard: () => void;
  onMenu: () => void;
}

interface Round {
  quote: Quote;
  leftPerson: Person;
  rightPerson: Person;
  correctSide: 'left' | 'right';
}

type FeedbackState = 'idle' | 'revealing';

export function GameScreen({ state, onUpdateState, onGameOver, onShowLeaderboard, onMenu }: GameScreenProps) {
  const [round, setRound] = useState<Round | null>(null);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [transitionKey, setTransitionKey] = useState(0);
  const currentGameId = useRef(state.gameId);

  const loadRound = useCallback(
    (currentState: GameState) => {
      const data = pickRound(currentState);
      if (!data) {
        onGameOver(currentState, round?.quote as Quote);
        return;
      }
      setRound(data);
      setSelectedSide(null);
      setFeedback('idle');
      setTransitionKey((k) => k + 1);
    },
    [onGameOver, round?.quote]
  );

  useEffect(() => {
    if (state.gameId !== currentGameId.current) {
      currentGameId.current = state.gameId;
    }
    loadRound(state);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gameId]);

  const handleSelect = (side: 'left' | 'right') => {
    if (feedback !== 'idle' || !round) return;

    setSelectedSide(side);
    const correct = side === round.correctSide;
    setFeedback('revealing');

    const newState: GameState = {
      ...state,
      usedQuoteIds: [...state.usedQuoteIds, round.quote.id],
      lastPersons: [round.leftPerson.name, round.rightPerson.name],
    };

    if (correct) {
      const newScore = state.score + 1;
      const newStreak = state.streak + 1;
      const newBestStreak = Math.max(state.bestStreak, newStreak);
      newState.score = newScore;
      newState.streak = newStreak;
      newState.bestStreak = newBestStreak;
      onUpdateState(newState);

      setTimeout(() => {
        loadRound(newState);
      }, 1200);
    } else {
      const newLives = state.lives - 1;
      newState.lives = newLives;
      newState.streak = 0;
      onUpdateState(newState);

      if (newLives <= 0) {
        setTimeout(() => {
          onGameOver(newState, round.quote);
        }, 1800);
      } else {
        setTimeout(() => {
          loadRound(newState);
        }, 1800);
      }
    }
  };

  if (!round) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-[var(--color-bg)]">
        <p className="text-gray-400 font-pixel animate-blink">Cargando...</p>
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
        score={state.score}
        streak={state.streak}
        bestStreak={state.bestStreak}
        lives={state.lives}
        startTime={state.startTime}
        onShowLeaderboard={onShowLeaderboard}
        onMenu={onMenu}
      />

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-3 sm:px-4 py-3 gap-2">
        {/* Quote — editorial style, no heavy border */}
        <div
          key={`q-${transitionKey}`}
          className="flex-shrink-0 animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          <QuoteCard text={round.quote.text} isFictional={round.quote.isFictional} />
        </div>

        {/* Versus arena — two cards with central VS badge */}
        <div
          key={`p-${transitionKey}`}
          className="animate-in fade-in duration-500 flex-1 relative grid grid-cols-2 gap-3 sm:gap-4 min-h-0 items-stretch"
        >
          {/* Left card */}
          <div className="animate-in slide-in-from-left duration-500 h-full">
            <PersonCard
              person={round.leftPerson}
              side="left"
              state={getCardState('left')}
              onClick={() => handleSelect('left')}
              disabled={feedback !== 'idle'}
            />
          </div>

          {/* Right card */}
          <div className="animate-in slide-in-from-right duration-500 h-full">
            <PersonCard
              person={round.rightPerson}
              side="right"
              state={getCardState('right')}
              onClick={() => handleSelect('right')}
              disabled={feedback !== 'idle'}
            />
          </div>

          {/* Central VS badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[var(--color-yellow)] border-2 border-[var(--color-ink)] rounded-full shadow-arcade-sm vs-pulse"
            >
              <span className="font-display text-xs sm:text-sm text-[var(--color-ink)]">VS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
