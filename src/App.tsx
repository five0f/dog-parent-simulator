import { useEffect, useState } from 'react';
import ActionPanel from './components/ActionPanel';
import DaySummary from './components/DaySummary';
import EndingScreen from './components/EndingScreen';
import IntroScreen from './components/IntroScreen';
import LocationMap from './components/LocationMap';
import Scene from './components/Scene';
import StatsPanel from './components/StatsPanel';
import { advanceIntro, applyChoice, continueAfterConsequence, createInitialState, dismissDaySummary, getDecision, loadGame, navigateToLocation, saveGame, timeOfDay, weekDays } from './game/gameLogic';
import type { GameState, LocationId } from './types';

export default function App() {
  const [state, setState] = useState<GameState>(() => loadGame());
  const decision = getDecision(state);

  useEffect(() => {
    saveGame(state);
  }, [state]);

  const restart = () => {
    setState(createInitialState());
  };

  const handleChoice = (choiceIndex: number) => {
    setState((current) => applyChoice(current, choiceIndex));
  };

  const handleNavigate = (location: LocationId) => {
    setState((current) => navigateToLocation(current, location));
  };

  const handleContinue = () => {
    setState((current) => continueAfterConsequence(current));
  };

  if (state.phase === 'intro') {
    return <IntroScreen step={state.introStep} onNext={() => setState((current) => advanceIntro(current))} />;
  }

  if (state.ending && !state.daySummary) {
    return <EndingScreen endingId={state.ending} state={state} onRestart={restart} />;
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div className="hud-card">
          <span>📅</span>
          <strong>{weekDays[(state.day - 1) % weekDays.length]}</strong>
          <small>День {state.day}</small>
        </div>
        <div className="hud-card">
          <span>🕒</span>
          <strong>{timeOfDay[state.timeIndex]}</strong>
          <small>{state.timeIndex === 0 ? '08:10' : state.timeIndex === 1 ? '13:30' : '18:45'}</small>
        </div>
      </header>

      <StatsPanel state={state} />
      <Scene state={state} decision={decision} />
      <ActionPanel state={state} decision={decision} onChoose={handleChoice} onContinue={handleContinue} />
      <LocationMap state={state} onNavigate={handleNavigate} />

      <button className="reset-button" onClick={restart} aria-label="Начать заново">
        ⚙️
      </button>

      {state.daySummary && <DaySummary summary={state.daySummary} onContinue={() => setState((current) => dismissDaySummary(current))} />}
    </main>
  );
}
