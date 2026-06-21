import { choiceIcons, getChoiceText } from '../presentation/choice-options';
import { type ChoiceVariant, choiceVariants, type EventChoice } from '../types';
import { ChoiceCard } from './choice-card';
import { actionBarClassName } from './ui-classes';

function ActionBar({ ariaLabel, children }: { ariaLabel: string; children: React.ReactNode }) {
  return (
    <section className={actionBarClassName} aria-label={ariaLabel}>
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
    <ActionBar ariaLabel='Варианты действий'>
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
    <ActionBar ariaLabel='Итоги дня'>
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
