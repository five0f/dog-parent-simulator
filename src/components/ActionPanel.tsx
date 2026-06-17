import type { Decision, GameState } from '../types';

interface Props {
  state: GameState;
  decision: Decision;
  isOpen: boolean;
  onChoose: (choiceIndex: number) => void;
  onRestart: () => void;
  onClose: () => void;
}

export default function ActionPanel({ state, decision, isOpen, onChoose, onRestart, onClose }: Props) {
  const locked = Boolean(state.daySummary || state.ending);

  return (
    <section className={`decision-panel ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <div className="decision-copy">
        <span>{state.mode === 'walk' ? `Прогулка ${state.walk.step}/${state.walk.total}` : 'Ситуация'}</span>
        <h2>{decision.title}</h2>
        <p>{decision.text}</p>
      </div>

      <div className="choice-grid">
        {decision.choices.map((choice, index) => (
          <button key={choice.title} onClick={() => onChoose(index)} disabled={locked}>
            <i>{['🎾', '👏', '🛋️', '🚪'][index] ?? '✨'}</i>
            <strong>{choice.title}</strong>
            <span>{choice.text}</span>
          </button>
        ))}
      </div>

      <div className="menu-actions">
        <button onClick={onClose}>Закрыть</button>
        <button className="restart-button" onClick={onRestart}>Заново</button>
      </div>
    </section>
  );
}
