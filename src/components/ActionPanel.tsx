import type { Decision, GameState } from '../types';

interface Props {
  state: GameState;
  decision: Decision;
  onChoose: (choiceIndex: number) => void;
  onContinue: () => void;
}

export default function ActionPanel({ state, decision, onChoose, onContinue }: Props) {
  const locked = Boolean(state.daySummary || state.ending);
  const consequence = state.pendingConsequence;

  if (state.phase === 'result' && consequence) {
    return (
      <section className="event-deck result-deck" aria-label="Последствие выбора">
        <article className="event-card result-card">
          <span>Вы выбрали: {consequence.choiceTitle}</span>
          <h2>Что изменилось</h2>
          <div className="result-story">
            <p>{consequence.result.bublik}</p>
            <p>{consequence.result.situation}</p>
            <p>{consequence.result.mood}</p>
            <p>{consequence.result.trust}</p>
            {consequence.result.thought && (
              <blockquote>
                <b>Мысль Бублика</b>
                <span>{consequence.result.thought}</span>
              </blockquote>
            )}
            {consequence.result.note && <small>{consequence.result.note}</small>}
          </div>
        </article>

        <div className="choice-zone result-zone" aria-label="Продолжение истории">
          <button onClick={onContinue} disabled={locked}>
            <strong>Продолжить</strong>
            <span>→</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="event-deck" aria-label="Текущее событие">
      <article className="event-card">
        <span>{state.mode === 'walk' ? 'Парк' : 'Дом'}</span>
        <h2>{decision.title}</h2>
        <p>{decision.text}</p>
      </article>

      <div className="choice-zone" aria-label="Варианты выбора">
        {decision.choices.map((choice, index) => (
          <button key={choice.title} onClick={() => onChoose(index)} disabled={locked}>
            <strong>{choice.title}</strong>
            <span>{choice.icon}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
