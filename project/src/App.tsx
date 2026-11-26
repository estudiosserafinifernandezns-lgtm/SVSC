import { useState, useRef, useEffect } from 'react';
import type { GameState, Screen, Quote } from '@/types';
import { getInitialGameState, setBestScore } from '@/lib/game';
import { StartScreen } from '@/screens/StartScreen';
import { GameScreen } from '@/screens/GameScreen';
import { ResultScreen } from '@/screens/ResultScreen';
import { LeaderboardScreen } from '@/screens/LeaderboardScreen';
import { CommunityScreen } from '@/screens/CommunityScreen';
import { SupportScreen } from '@/screens/SupportScreen';
import { MultiplayerMenu } from '@/screens/MultiplayerMenu';
import { MultiplayerLobby } from '@/screens/MultiplayerLobby';
import { MultiplayerGame } from '@/screens/MultiplayerGame';
import { MultiplayerResult } from '@/screens/MultiplayerResult';
import { parseJoinCodeFromUrl, clearJoinCodeFromUrl, type MpSession, type MpState } from '@/lib/multiplayer';

function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [gameState, setGameState] = useState<GameState>(getInitialGameState);
  const [lastQuote, setLastQuote] = useState<Quote | null>(null);
  const previousScreen = useRef<Screen>('start');
  const gameStarted = useRef(false);
  const [mpSession, setMpSession] = useState<MpSession | null>(null);
  const [mpFinalState, setMpFinalState] = useState<MpState | null>(null);
  const [mpAutoJoinError, setMpAutoJoinError] = useState('');
  const [pendingJoinCode, setPendingJoinCode] = useState<string | null>(null);

  const handleStart = () => {
    setGameState(getInitialGameState());
    setLastQuote(null);
    gameStarted.current = true;
    setScreen('game');
  };

  const handleGameOver = (finalState: GameState, quote: Quote) => {
    setBestScore(finalState.score);
    setGameState(finalState);
    setLastQuote(quote);
    setScreen('result');
  };

  const handlePlayAgain = () => {
    setGameState(getInitialGameState());
    setLastQuote(null);
    setScreen('game');
  };

  const handleMenu = () => {
    setScreen('start');
  };

  const handleShowLeaderboard = () => {
    previousScreen.current = screen;
    setScreen('leaderboard');
  };

  const handleShowCommunity = () => {
    previousScreen.current = screen;
    setScreen('community');
  };

  const handleShowSupport = () => {
    previousScreen.current = screen;
    setScreen('support');
  };

  const handleBackFromSecondary = () => {
    const prev = previousScreen.current;
    if (prev === 'game' && gameStarted.current) {
      setScreen('game');
    } else if (prev === 'result' && lastQuote) {
      setScreen('result');
    } else {
      setScreen('start');
    }
  };

  const handleBackFromLeaderboard = handleBackFromSecondary;

  const handleShowMpMenu = () => {
    setMpAutoJoinError('');
    setScreen('mp-menu');
  };

  const handleMpSession = (session: MpSession) => {
    setMpSession(session);
    setPendingJoinCode(null);
    setScreen('mp-lobby');
  };

  const handleMpGameStart = () => {
    setScreen('mp-game');
  };

  const handleMpGameEnd = (state: MpState) => {
    setMpFinalState(state);
    setScreen('mp-result');
  };

  const handleMpRematch = () => {
    // For rematch, go back to lobby — the rematch RPC creates a new room.
    // For now, return to the multiplayer menu so players can start fresh.
    setMpFinalState(null);
    setMpSession(null);
    setScreen('mp-menu');
  };

  const handleMpLeave = () => {
    setMpSession(null);
    setMpFinalState(null);
    setScreen('start');
  };

  // Auto-join via URL: #join=CODE
  // Instead of silently using the stored nickname (which may be the host's
  // when testing in the same browser), send the guest to the multiplayer
  // menu with the code pre-filled so they enter their own nickname.
  useEffect(() => {
    const code = parseJoinCodeFromUrl();
    if (!code) return;
    clearJoinCodeFromUrl();
    setPendingJoinCode(code);
    setScreen('mp-menu');
  }, []);

  return (
    <>
      {/* Start screen */}
      <div className={screen === 'start' ? 'block' : 'hidden'}>
        <StartScreen
          onStart={handleStart}
          onShowLeaderboard={handleShowLeaderboard}
          onShowCommunity={handleShowCommunity}
          onShowSupport={handleShowSupport}
          onShowMpMenu={handleShowMpMenu}
          mpAutoJoinError={mpAutoJoinError}
        />
      </div>

      {/* Game screen — kept mounted to preserve round state during leaderboard visits */}
      <div className={screen === 'game' ? 'block' : 'hidden'}>
        <GameScreen
          state={gameState}
          onUpdateState={setGameState}
          onGameOver={handleGameOver}
          onShowLeaderboard={handleShowLeaderboard}
          onMenu={handleMenu}
        />
      </div>

      {/* Result screen */}
      {lastQuote && (
        <div className={screen === 'result' ? 'block' : 'hidden'}>
          <ResultScreen
            state={gameState}
            lastQuote={lastQuote}
            onPlayAgain={handlePlayAgain}
            onMenu={handleMenu}
            onShowLeaderboard={handleShowLeaderboard}
          />
        </div>
      )}

      {/* Leaderboard screen — rendered on top */}
      {screen === 'leaderboard' && (
        <LeaderboardScreen onBack={handleBackFromLeaderboard} />
      )}

      {/* Community screen — rendered on top */}
      {screen === 'community' && (
        <CommunityScreen onBack={handleBackFromSecondary} />
      )}

      {/* Support screen — rendered on top */}
      {screen === 'support' && <SupportScreen onBack={handleBackFromSecondary} />}

      {/* Multiplayer menu */}
      {screen === 'mp-menu' && (
        <MultiplayerMenu
          onBack={handleMenu}
          onSession={handleMpSession}
          pendingJoinCode={pendingJoinCode}
        />
      )}

      {/* Multiplayer lobby */}
      {screen === 'mp-lobby' && mpSession && (
        <MultiplayerLobby
          session={mpSession}
          onLeave={handleMpLeave}
          onGameStart={handleMpGameStart}
        />
      )}

      {/* Multiplayer game */}
      {screen === 'mp-game' && mpSession && (
        <MultiplayerGame
          session={mpSession}
          onGameEnd={handleMpGameEnd}
          onLeave={handleMpLeave}
        />
      )}

      {/* Multiplayer result */}
      {screen === 'mp-result' && mpFinalState && mpSession && (
        <MultiplayerResult
          state={mpFinalState}
          session={{ playerId: mpSession.playerId, nickname: mpSession.nickname }}
          onRematch={handleMpRematch}
          onMenu={handleMpLeave}
        />
      )}
    </>
  );
}

export default App;
