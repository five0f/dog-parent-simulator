import type { Decision, GameState } from '../types';

interface Props {
  state: GameState;
  decision: Decision;
  isOpen: boolean;
  onChoose: (choiceIndex: number) => void;
  onClose: () => void;
}

export default function ActionPanel({ state, decision, isOpen, onChoose, onClose }: Props) {
  const locked = Boolean(state.daySummary || state.ending);

  return (
    <section className={`context-menu ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <div className="context-title">
        <span>{state.mode === 'walk' ? 'Парк' : 'Дом'}</span>
        <h2>{decision.title}</h2>
        <p>{decision.text}</p>
      </div>

      <div className="context-actions">
        {decision.choices.map((choice, index) => (
          <button key={choice.title} onClick={() => onChoose(index)} disabled={locked}>
            <i>{choice.icon}</i>
            <strong>{choice.title}</strong>
            <small>{choice.text}</small>
          </button>
        ))}
      </div>

      <button className="context-close" onClick={onClose}>Закрыть</button>
    </section>
  );
}
