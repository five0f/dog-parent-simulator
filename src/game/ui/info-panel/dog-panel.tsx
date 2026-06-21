import { getStatStateText } from '../../presentation/dog-status';
import type { MeterState, SkillState } from '../../types';
import { modalBodyTextClassName, modalListClassName, modalTitleClassName } from '../ui-classes';
import { PanelSection } from './panel-section';

const skillDisplayOrder: SkillState['id'][] = ['sit', 'heel', 'place', 'fetch'];

export function DogPanel({ meters, skills }: { meters: MeterState[]; skills: SkillState[] }) {
  const meterItems = meters.map(meter => ({
    id: meter.id,
    stateText: getStatStateText(meter.id, meter.value),
    title: meter.title,
  }));
  const orderedSkills = skillDisplayOrder.flatMap(id => skills.filter(skill => skill.id === id));

  return (
    <>
      <h2 id='dog-modal-title' className={modalTitleClassName}>
        Бублик
      </h2>
      <p className='m-0 mt-2 text-lg font-normal text-ink-soft max-xs:text-base'>4 месяца</p>
      <PanelSection title='Состояние'>
        <MeterList items={meterItems} />
      </PanelSection>
      <PanelSection title='Характер'>
        <p className={`m-0 ${modalBodyTextClassName}`}>Характер Бублика ещё формируется.</p>
      </PanelSection>
      <PanelSection title='Навыки'>
        <ul className={modalListClassName}>
          {orderedSkills.map(skill => (
            <li className={modalBodyTextClassName} key={skill.id}>
              {skill.title}
            </li>
          ))}
        </ul>
      </PanelSection>
    </>
  );
}

function MeterList({
  items,
}: {
  items: {
    id: string;
    stateText: string;
    title: string;
  }[];
}) {
  return (
    <ul className={modalListClassName}>
      {items.map(item => (
        <li className={modalBodyTextClassName} key={item.id}>
          {item.title} — {item.stateText}
        </li>
      ))}
    </ul>
  );
}
