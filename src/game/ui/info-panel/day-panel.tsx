import { cn } from '../../../lib/class-names';
import {
  getGoalDisplayText,
  getGoalStatusLabel,
  getModalConsequences,
  getModalJournal,
} from '../../presentation/info-panel-text';
import type { DayGoal, GameState, GoalStatus } from '../../types';
import { CloseButton } from './close-button';
import { goalItemClassName } from './panel-classes';
import { PanelSection } from './panel-section';

export function DayPanel({
  displayTimeLabel,
  onClose,
  state,
}: {
  displayTimeLabel: string;
  onClose: () => void;
  state: GameState;
}) {
  return (
    <>
      <h2
        id='day-modal-title'
        className='m-0 text-[30px] leading-[1.03] font-bold text-ink max-[900px]:text-[28px] max-[520px]:text-[26px]'
      >
        День {state.day} • {displayTimeLabel}
      </h2>
      <p className='m-0 mt-2 text-[22px] font-normal text-ink-soft max-[520px]:text-xl'>
        {getDayPanelSubtitle(state, displayTimeLabel)}
      </p>
      <PanelSection title='Цели дня'>
        <GoalList goals={state.goals} />
      </PanelSection>
      <PanelSection title='Журнал событий'>
        <EntryList entries={getModalJournal(state.journal)} />
      </PanelSection>
      <PanelSection title='Последствия'>
        <EntryList entries={getModalConsequences(state.journal)} />
      </PanelSection>
      <CloseButton onClick={onClose} />
    </>
  );
}

function getDayPanelSubtitle(state: GameState, displayTimeLabel: string) {
  if (state.phase === 'daySummary') {
    return state.flags.homeDamage === true ? 'День с последствиями' : 'День без катастроф';
  }

  if (displayTimeLabel === 'День' || displayTimeLabel === 'Прогулка') {
    return 'Прогулка в процессе';
  }

  if (displayTimeLabel === 'Вечер') {
    return 'Вечер после прогулки';
  }

  return state.flags.homeDamage === true ? 'Утро уже с последствиями' : 'Утро в процессе';
}

function GoalList({ goals }: { goals: DayGoal[] }) {
  return (
    <ul className='m-0 grid list-none gap-2.5 p-0'>
      {goals.map(goal => {
        const displayGoal = getGoalDisplayText(goal.id);

        return (
          <li className={goalItemClassName} key={goal.id}>
            <strong className='text-[22px] leading-[1.06] text-ink max-[520px]:text-xl'>
              {displayGoal.title}
            </strong>
            <span
              className={cn(
                'text-[15px] font-bold whitespace-nowrap max-[900px]:whitespace-normal',
                getGoalStatusClassName(goal.status)
              )}
            >
              Статус: {getGoalStatusLabel(goal.status)}
            </span>
            <small className='col-span-full text-base leading-[1.2] font-normal text-description max-[520px]:text-[15px]'>
              {displayGoal.description}
            </small>
          </li>
        );
      })}
    </ul>
  );
}

function EntryList({ entries }: { entries: string[] }) {
  return (
    <ul className='m-0 grid list-none gap-2.5 p-0'>
      {entries.map((entry, index) => (
        <li
          className='text-lg leading-[1.2] font-normal text-ink-soft max-[520px]:text-base'
          key={`${entry}-${String(index)}`}
        >
          — {entry}
        </li>
      ))}
    </ul>
  );
}

function getGoalStatusClassName(status: GoalStatus) {
  if (status === 'done') return 'text-success';
  if (status === 'failed') return 'text-danger';
  if (status === 'at_risk') return 'text-warning';
  return 'text-[#7d3328]';
}
