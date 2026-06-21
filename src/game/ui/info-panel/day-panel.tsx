import { cn } from '../../../lib/class-names';
import {
  getGoalDisplayText,
  getGoalStatusLabel,
  getModalConsequences,
  getModalJournal,
} from '../../presentation/info-panel-text';
import type { DayGoal, GameState, GoalStatus } from '../../types';
import { modalBodyTextClassName, modalListClassName, modalTitleClassName } from '../ui-classes';
import { goalItemClassName } from './panel-classes';
import { PanelSection } from './panel-section';

export function DayPanel({
  displayTimeLabel,
  state,
}: {
  displayTimeLabel: string;
  state: GameState;
}) {
  return (
    <>
      <h2 id='day-modal-title' className={modalTitleClassName}>
        День {state.day} • {displayTimeLabel}
      </h2>
      <p className='m-0 mt-1 text-xl font-normal text-ink-soft max-xs:text-lg'>
        {getDayPanelSubtitle(state, displayTimeLabel)}
      </p>
      <PanelSection title='Цели дня'>
        <GoalList goals={state.goals} />
      </PanelSection>
      <PanelSection title='Журнал событий'>
        <EntryList scrollable entries={getModalJournal(state.journal)} />
      </PanelSection>
      <PanelSection title='Последствия'>
        <EntryList entries={getModalConsequences(state.journal)} />
      </PanelSection>
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

  return 'Утро уже с последствиями';
}

function GoalList({ goals }: { goals: DayGoal[] }) {
  return (
    <ul className={modalListClassName}>
      {goals.map(goal => {
        const displayGoal = getGoalDisplayText(goal.id);

        return (
          <li className={goalItemClassName} key={goal.id}>
            <strong className='text-xl/tight font-bold text-ink max-xs:text-lg'>
              {displayGoal.title}
            </strong>
            <span
              className={cn(
                'text-sm font-bold whitespace-nowrap max-md:whitespace-normal',
                getGoalStatusClassName(goal.status)
              )}
            >
              Статус: {getGoalStatusLabel(goal.status)}
            </span>
            <small className='col-span-full text-sm/snug font-normal text-description'>
              {displayGoal.description}
            </small>
          </li>
        );
      })}
    </ul>
  );
}

function EntryList({ entries, scrollable = false }: { entries: string[]; scrollable?: boolean }) {
  return (
    <ul
      className={cn(
        modalListClassName,
        scrollable && entries.length > 4 && 'max-h-30 overflow-y-auto pr-2'
      )}
    >
      {entries.map((entry, index) => (
        <li className={modalBodyTextClassName} key={`${entry}-${String(index)}`} title={entry}>
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
  return 'text-emphasis';
}
