import { uiAssets } from '../../assets';
import {
  alwaysVisibleTraits,
  getSkillStateText,
  getStatStateText,
} from '../../presentation/dog-status';
import type { DogTraitBadge, GameState, MeterState, SkillState } from '../../types';
import { TrustHearts } from '../trust-hearts';
import { CloseButton } from './close-button';
import { valueItemClassName, valueStateClassName } from './panel-classes';
import { PanelSection } from './panel-section';
import { TraitItem } from './trait-item';

export function DogPanel({
  meters,
  onClose,
  skills,
  state,
  unlockedTraits,
}: {
  meters: MeterState[];
  onClose: () => void;
  skills: SkillState[];
  state: GameState;
  unlockedTraits: DogTraitBadge[];
}) {
  const extraUnlockedTraits = unlockedTraits.flatMap(trait =>
    alwaysVisibleTraits.includes(trait.title) ? [] : [trait]
  );
  const meterItems = meters.map(meter => ({
    id: meter.id,
    stateText: getStatStateText(meter.id, meter.value),
    title: meter.title,
    value: meter.value,
  }));
  const skillItems = skills.map(skill => ({
    id: skill.id,
    stateText: getSkillStateText(skill.value),
    title: skill.title,
    value: skill.value,
  }));

  return (
    <>
      <div className='flex items-center gap-4.5'>
        <img
          className='size-24 object-contain max-[520px]:size-20'
          src={uiAssets.dogAvatar}
          alt='Бублик'
        />
        <div>
          <h2
            id='dog-modal-title'
            className='m-0 text-[30px] leading-[1.03] font-bold text-ink max-[900px]:text-[28px] max-[520px]:text-[26px]'
          >
            Бублик
          </h2>
          <p className='m-0 mt-2 text-xl font-normal text-ink-soft max-[520px]:text-lg'>4 месяца</p>
          <div className='mt-2'>
            <TrustHearts value={state.stats.trust} />
          </div>
        </div>
      </div>
      <PanelSection compact title='Состояние'>
        <ValueList items={meterItems} />
      </PanelSection>
      <PanelSection compact title='Навыки'>
        <ValueList items={skillItems} />
      </PanelSection>
      <PanelSection compact title='Черты характера'>
        <ul className='m-0 grid list-disc gap-1.5 pl-5'>
          {alwaysVisibleTraits.map(trait => (
            <TraitItem key={trait}>{trait}</TraitItem>
          ))}
          {extraUnlockedTraits.map(trait => (
            <TraitItem key={trait.id} title={trait.description}>
              {trait.title}
            </TraitItem>
          ))}
        </ul>
      </PanelSection>
      <CloseButton onClick={onClose} />
    </>
  );
}

function ValueList({
  items,
}: {
  items: {
    id: string;
    stateText: string;
    title: string;
    value: number;
  }[];
}) {
  return (
    <ul className='m-0 grid list-none grid-cols-2 gap-x-6 gap-y-1 p-0 max-[520px]:gap-x-4'>
      {items.map(item => (
        <li className={valueItemClassName} key={item.id}>
          <strong className='text-[22px] leading-[1.06] text-ink max-[520px]:text-xl'>
            {item.title}
          </strong>
          <span className={valueStateClassName}>{item.stateText}</span>
          <small className='col-span-full text-base leading-[1.2] font-normal text-description max-[520px]:text-[15px]'>
            {item.value}/100
          </small>
        </li>
      ))}
    </ul>
  );
}
