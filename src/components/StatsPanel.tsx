import dogAvatar from '../assets/dog/dog-happy.png';
import { conditionLabel, traitSummary } from '../game/gameLogic';
import type { GameState, StatKey } from '../types';

interface Props {
  state: GameState;
}

const compactStats: Array<{ key: StatKey; title: string; icon: string; onlyWhenProblem?: boolean }> = [
  { key: 'mood', title: 'Настроение', icon: '🙂' },
  { key: 'trust', title: 'Доверие', icon: '♥' },
  { key: 'health', title: 'Здоровье', icon: '✚', onlyWhenProblem: true },
];

export default function StatsPanel({ state }: Props) {
  const traits = traitSummary(state);

  return (
    <aside className="bublik-card">
      <img src={dogAvatar} alt="Бублик" />
      <div className="bublik-main">
        <h2>Бублик</h2>
        <small>{traits.map((trait) => trait.title).join(' · ')}</small>
      </div>
      <div className="mini-stats">
        {compactStats.filter((stat) => !stat.onlyWhenProblem || state.stats[stat.key] < 68).map((stat) => (
          <span key={stat.key}>
            <i>{stat.icon}</i>
            <em>{stat.title}</em>
            <b>{conditionLabel(stat.key, state.stats[stat.key])}</b>
          </span>
        ))}
      </div>
    </aside>
  );
}
