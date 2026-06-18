import dogAvatar from '../assets/dog/dog-idle.png';
import { achievementLabels, habitLabels, problemLabels } from '../data/development';
import { conditionLabel, traitSummary } from '../game/gameLogic';
import type { GameState, StatKey } from '../types';

interface Props {
  state: GameState;
}

const compactStats: Array<{ key: StatKey; title: string; icon: string; onlyWhenProblem?: boolean }> = [
  { key: 'mood', title: 'Настроение', icon: '🙂' },
  { key: 'trust', title: 'Доверие', icon: '♥' },
];

export default function StatsPanel({ state }: Props) {
  const traits = traitSummary(state);
  const recentJournal = state.development.journal.slice(0, 3);

  return (
    <aside className="bublik-card">
      <img src={dogAvatar} alt="Бублик" />
      <div className="bublik-main">
        <span>Бублик сейчас</span>
        <h2>Бублик</h2>
      </div>

      <section className="development-section problem-section" aria-label="Проблемы Бублика">
        <h3>Проблемы</h3>
        {state.development.problems.length ? (
          <ul>
            {state.development.problems.slice(0, 3).map((problem) => (
              <li key={problem}>⚠ {problemLabels[problem]}</li>
            ))}
          </ul>
        ) : (
          <p>Пока без серьёзных проблем.</p>
        )}
      </section>

      <section className="development-section" aria-label="Хорошие привычки Бублика">
        <h3>Хорошие привычки</h3>
        {state.development.habits.length ? (
          <ul>
            {state.development.habits.slice(0, 3).map((habit) => (
              <li key={habit}>✓ {habitLabels[habit]}</li>
            ))}
          </ul>
        ) : (
          <p>Ещё формируются.</p>
        )}
      </section>

      <section className="development-section" aria-label="Черты характера Бублика">
        <h3>Черты характера</h3>
        <div className="trait-pills">
          {traits.length ? traits.map((trait) => <span key={trait.id}>{trait.title}</span>) : <span>Пока раскрывается</span>}
        </div>
      </section>

      <section className="development-section story-section" aria-label="История Бублика">
        <h3>История Бублика</h3>
        {recentJournal.length ? (
          <ol>
            {recentJournal.map((entry) => (
              <li key={`${entry.day}-${entry.title}`}>
                <b>День {entry.day}</b>
                <span>{entry.title}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p>Сегодня всё только начинается.</p>
        )}
      </section>

      {state.development.achievements.length > 0 && (
        <section className="development-section achievement-section" aria-label="Достижения воспитания">
          <h3>Достижения</h3>
          <p>✓ {achievementLabels[state.development.achievements[0]]}</p>
        </section>
      )}

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
