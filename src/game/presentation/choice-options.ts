import type { ChoiceVariant, EventChoice } from '../types';

export const choiceIcons: Record<ChoiceVariant, string> = {
  negative: '✋',
  neutral: '↔',
  positive: '♥',
};

export function getChoiceText(choice: EventChoice) {
  if (choice.id.includes('exchange-sock')) {
    return { description: 'Похвалить и дать игрушку', label: 'Обменять' };
  }

  if (choice.id.includes('ignore-sock')) {
    return { description: 'Оставить Бублика с носком', label: 'Не замечать' };
  }

  if (choice.id.includes('take-sock')) {
    return { description: 'Просто забрать носок', label: 'Забрать' };
  }

  if (choice.variant === 'positive')
    return { description: 'Мягко и с доверием', label: choice.label };
  if (choice.variant === 'negative')
    return { description: 'Быстро, но рискованно', label: choice.label };
  return { description: 'Посмотреть, что будет', label: choice.label };
}
