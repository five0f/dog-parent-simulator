import type { DaySummaryData } from '../types';

interface Props {
  summary: DaySummaryData;
  onContinue: () => void;
}

export default function DaySummary({ summary, onContinue }: Props) {
  return (
    <div className="modal-backdrop">
      <section className="modal summary-modal">
        <span className="modal-kicker">День закончился</span>
        <h2>{summary.title}</h2>
        <div className="summary-list">
          {summary.notes.map((note, index) => (
            <p key={`${note}-${index}`}>{note}</p>
          ))}
        </div>
        <div className="summary-numbers">
          {summary.conditionLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <button onClick={onContinue}>Проснуться завтра</button>
      </section>
    </div>
  );
}
