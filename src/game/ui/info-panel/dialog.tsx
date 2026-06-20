import type { DogTraitBadge, GameState, MeterState, SkillState } from '../../types';
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
  unlockedTraits,
}: {
  activePanel: InfoPanelId;
  displayTimeLabel: string;
  meters: MeterState[];
  onClose: () => void;
  skills: SkillState[];
  state: GameState;
  unlockedTraits: DogTraitBadge[];
}) {
  return (
    <dialog
      className='absolute inset-0 z-80 m-0 size-full max-h-none max-w-none border-0 bg-transparent p-0'
      aria-labelledby={`${activePanel}-modal-title`}
      aria-modal='true'
      open
    >
      <button
        className='absolute inset-0 z-80 cursor-default border-0 bg-[rgba(12,8,5,0.58)] p-0'
        type='button'
        aria-label='Закрыть панель'
        onClick={onClose}
      />
      <div className='absolute top-16 right-11 z-90 box-border max-h-[min(900px,calc(100vh-96px))] w-175 max-w-[calc(100vw-80px)] overflow-auto rounded-3xl border-0 bg-surface bg-(image:--choice-card) bg-size-[100%_100%] bg-center bg-no-repeat px-14 pt-10.5 pb-9.5 max-[900px]:inset-x-4 max-[900px]:top-29.5 max-[900px]:max-h-[calc(100vh-142px)] max-[900px]:w-auto max-[900px]:max-w-none max-[900px]:p-7 max-[520px]:inset-x-3 max-[520px]:top-22 max-[520px]:max-h-[calc(100vh-104px)] max-[520px]:px-6 max-[520px]:pt-6 max-[520px]:pb-5'>
        {activePanel === 'day' ? (
          <DayPanel displayTimeLabel={displayTimeLabel} state={state} onClose={onClose} />
        ) : (
          <DogPanel
            meters={meters}
            skills={skills}
            state={state}
            unlockedTraits={unlockedTraits}
            onClose={onClose}
          />
        )}
      </div>
    </dialog>
  );
}
