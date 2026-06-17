import { conditionLabel, traitSummary } from '../game/gameLogic';
import type { GameState, StatKey } from '../types';

interface Props {
  state: GameState;
}

const visibleStates: Array<{ key: StatKey; title: string; icon: string }> = [
  { key: 'mood', title: 'Настроение', icon: '🙂' },
  { key: 'health', title: 'Здоровье', icon: '✚' },
  { key: 'trust', title: 'Доверие', icon: '♥' },
];

export default function StatsPanel({ state }: Props) {
  const traits = traitSummary(state);
  const completedGoals = state.goals.filter((goal) => goal.done);

  return (
    <aside className="story-panel">
      <section className="dog-card">
        <span className="dog-avatar">🐶</span>
        <div>
          <h2>Бублик ♂</h2>
          <small>{traits.map((trait) => trait.title).join(' · ')}</small>
        </div>
      </section>

      <section className="state-cloud">
        {visibleStates.map((item) => (
          <span key={item.key}>
            <i>{item.icon}</i>
            <b>{item.title}</b>
            {conditionLabel(item.key, state.stats[item.key])}
          </span>
        ))}
      </section>

      <section className="memories">
        <h3>Сегодня</h3>
        {state.memories.slice(0, 4).map((memory, index) => (
          <p key={`${memory}-${index}`}>{memory}</p>
        ))}
        <button>Открыть дневник <span>›</span></button>
        {completedGoals.length > 0 && <small>Целей недели: {completedGoals.length}</small>}
      </section>
    </aside>
  );
}
