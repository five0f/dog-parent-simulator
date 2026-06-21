import type { GameState, MeterState, SkillState } from '../../types';
import {
  modalBackdropClassName,
  modalCloseClassName,
  modalContentClassName,
  modalPanelClassName,
  modalRootClassName,
} from '../ui-classes';
import { DayPanel } from './day-panel';
import { DogPanel } from './dog-panel';

export type InfoPanelId = 'day' | 'dog';

export function InfoPanelDialog({
  activePanel,
  displayTimeLabel,
  meters,
  onClose,
  skills,
  state,
}: {
  activePanel: InfoPanelId;
  displayTimeLabel: string;
  meters: MeterState[];
  onClose: () => void;
  skills: SkillState[];
  state: GameState;
}) {
  return (
    <dialog
      className={modalRootClassName}
      aria-labelledby={`${activePanel}-modal-title`}
      aria-modal='true'
      open
    >
      <button
        className={modalBackdropClassName}
        type='button'
        aria-label='Закрыть окно'
        onClick={onClose}
      />
      <div className={modalPanelClassName}>
        <button
          className={modalCloseClassName}
          type='button'
          aria-label='Закрыть'
          onClick={onClose}
        >
          ×
        </button>
        <div className={modalContentClassName}>
          {activePanel === 'day' ? (
            <DayPanel displayTimeLabel={displayTimeLabel} state={state} />
          ) : (
            <DogPanel meters={meters} skills={skills} />
          )}
        </div>
      </div>
    </dialog>
  );
}
