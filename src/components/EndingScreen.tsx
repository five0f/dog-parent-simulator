import { endings } from '../data/events';
import type { EndingId, GameState } from '../types';

interface Props {
  endingId: EndingId;
  state: GameState;
  onRestart: () => void;
}

export default function EndingScreen({ endingId, state, onRestart }: Props) {
  const ending = endings[endingId];

  return (
    <div className="ending-screen">
      <div className="ending-scene">
        <span className="ending-dog">🐕</span>
        <span className="ending-person">🧍</span>
      </div>
      <div className="ending-copy">
        <span>Финал недели</span>
        <h1>{ending.title}</h1>
        <p>{ending.text}</p>
        <div className="ending-score">
          <b>Воспоминаний: {state.memories.length}</b>
          <b>Доверие: {state.stats.trust >= 68 ? 'крепкое' : state.stats.trust >= 35 ? 'растёт' : 'хрупкое'}</b>
          <b>Настроение: {state.stats.mood >= 68 ? 'счастлив' : state.stats.mood >= 35 ? 'спокоен' : 'грустит'}</b>
        </div>
        <button onClick={onRestart}>Начать заново</button>
      </div>
    </div>
  );
}
