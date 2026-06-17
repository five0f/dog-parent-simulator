import type { Decision } from '../types';

interface Props {
  decision: Decision;
  onChoose: (choiceIndex: number) => void;
}

export default function EventModal({ decision, onChoose }: Props) {
  return (
    <div className="modal-backdrop">
      <section className="modal">
        <span className="modal-kicker">Событие</span>
        <h2>{decision.title}</h2>
        <p>{decision.text}</p>
        <div className="choice-list">
          {decision.choices.map((choice, index) => (
            <button key={choice.title} onClick={() => onChoose(index)}>
              <strong>{choice.title}</strong>
              <span>{choice.text}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
