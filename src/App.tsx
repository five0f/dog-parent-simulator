import { useEffect, useState } from 'react';
import ActionPanel from './components/ActionPanel';
import DaySummary from './components/DaySummary';
import EndingScreen from './components/EndingScreen';
import LocationMap from './components/LocationMap';
import Scene from './components/Scene';
import StatsPanel from './components/StatsPanel';
import { applyChoice, createInitialState, dismissDaySummary, getDecision, loadGame, saveGame, timeOfDay } from './game/gameLogic';
import type { GameState } from './types';

export default function App() {
  const [state, setState] = useState<GameState>(() => loadGame());
  const [isDogMenuOpen, setIsDogMenuOpen] = useState(false);
  const decision = getDecision(state);

  useEffect(() => {
    saveGame(state);
  }, [state]);

  const restart = () => {
    setIsDogMenuOpen(false);
    setState(createInitialState());
  };

  const handleChoice = (choiceIndex: number) => {
    setIsDogMenuOpen(false);
    setState((current) => applyChoice(current, choiceIndex));
  };

  const handleContinueDay = () => {
    setState((current) => dismissDaySummary(current));
  };

  if (state.ending && !state.daySummary) {
    return <EndingScreen endingId={state.ending} state={state} onRestart={restart} />;
  }

  return (
    <main className={`app-shell mode-${state.mode}`}>
      <header className="top-bar">
        <div className="hud-tile">
          <span>📅</span>
          <strong>День {state.day}</strong>
          <small>Пн</small>
        </div>
        <div className="hud-tile">
          <span>🌤️</span>
          <strong>{timeOfDay[state.timeIndex]}</strong>
          <small>{state.timeIndex === 3 ? '22:10' : state.timeIndex === 2 ? '18:45' : state.timeIndex === 1 ? '13:20' : '08:15'}</small>
        </div>
        <div className="hud-tile">
          <span>{state.mode === 'walk' ? '🌦️' : '☁️'}</span>
          <strong>{state.mode === 'walk' ? '+16°' : '+18°'}</strong>
          <small>{state.mode === 'walk' ? 'Свежо' : 'Облачно'}</small>
        </div>
        <div className="money-pill">🦴 {state.money} ₽</div>
        <button className="round-button" onClick={restart} title="Начать заново">↻</button>
      </header>

      <div className="game-stage">
        <Scene state={state} decision={decision} onDogClick={() => setIsDogMenuOpen((value) => !value)} />
        <StatsPanel state={state} />
        <ActionPanel
          state={state}
          decision={decision}
          isOpen={isDogMenuOpen}
          onChoose={handleChoice}
          onRestart={restart}
          onClose={() => setIsDogMenuOpen(false)}
        />
        <LocationMap state={state} />
      </div>

      {state.daySummary && <DaySummary summary={state.daySummary} onContinue={handleContinueDay} />}
    </main>
  );
}
