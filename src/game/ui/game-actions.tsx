import type { ReactNode } from 'react';

import { cn } from '../../lib/class-names';
import { choiceIcons, getChoiceText } from '../presentation/choice-options';
import { type ChoiceVariant, choiceVariants, type EventChoice } from '../types';
import { ChoiceCard } from './choice-card';

const actionBarBaseClassName =
  'absolute bottom-11.25 left-1/2 z-30 flex -translate-x-1/2 justify-center max-[900px]:inset-x-0 max-[900px]:bottom-4.5 max-[900px]:w-full max-[900px]:translate-x-0 max-[900px]:[scroll-snap-type:x_proximity] max-[900px]:gap-3 max-[900px]:overflow-x-auto max-[900px]:px-4 max-[900px]:pb-1';

function ActionBar({
  ariaLabel,
  children,
  collapseWide = false,
  desktopGap = 'gap-3.75',
  mobileAlign = 'center',
}: {
  ariaLabel: string;
  children: ReactNode;
  collapseWide?: boolean;
  desktopGap?: string;
  mobileAlign?: 'center' | 'start';
}) {
  return (
    <section
      className={cn(
        actionBarBaseClassName,
        desktopGap,
        collapseWide && 'max-[1200px]:gap-0',
        mobileAlign === 'start' ? 'max-[900px]:justify-start' : 'max-[900px]:justify-center'
      )}
      aria-label={ariaLabel}
    >
      {children}
    </section>
  );
}

export function ChoiceActionBar({
  choices,
  onChoose,
}: {
  choices: EventChoice[];
  onChoose: (choiceId: string) => void;
}) {
  const orderedChoices = choiceVariants.flatMap(variant =>
    choices.filter(choice => choice.variant === variant)
  );

  return (
    <ActionBar ariaLabel='Варианты действий' collapseWide mobileAlign='start'>
      {orderedChoices.map(choice => {
        const choiceText = getChoiceText(choice);

        return (
          <ChoiceCard
            description={choiceText.description}
            icon={choiceIcons[choice.variant]}
            key={choice.id}
            label={choiceText.label}
            variant={choice.variant}
            onClick={() => {
              onChoose(choice.id);
            }}
          />
        );
      })}
    </ActionBar>
  );
}

export function ResultActionBar({
  completeDay,
  onContinue,
  variant,
}: {
  completeDay?: boolean;
  onContinue: () => void;
  variant?: ChoiceVariant;
}) {
  return (
    <ActionBar ariaLabel='Продолжить'>
      <ChoiceCard
        description={completeDay ? 'Посмотреть итоги дня' : 'К следующей ситуации'}
        icon='→'
        label='Дальше'
        variant={variant ?? 'positive'}
        wide
        onClick={onContinue}
      />
    </ActionBar>
  );
}

export function DaySummaryActionBar({
  hasNextDay,
  onNextDay,
  onReset,
}: {
  hasNextDay: boolean;
  onNextDay: () => void;
  onReset: () => void;
}) {
  return (
    <ActionBar ariaLabel='Итоги дня' desktopGap='gap-0'>
      {hasNextDay && (
        <ChoiceCard
          description='Бублик проснётся другим'
          icon='☀'
          label='Следующий день'
          variant='positive'
          onClick={onNextDay}
        />
      )}
      <ChoiceCard
        description='Вернуться к первому утру'
        icon='↺'
        label='Начать заново'
        variant='neutral'
        wide={!hasNextDay}
        onClick={onReset}
      />
    </ActionBar>
  );
}
