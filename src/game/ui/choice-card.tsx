import { cn } from '../../lib/class-names';
import type { ChoiceVariant } from '../types';
import { choiceCardClassName, choiceCardWideClassName } from './ui-classes';

export function ChoiceCard({
  description,
  icon,
  label,
  onClick,
  wide = false,
  variant,
}: {
  description: string;
  icon: string;
  label: string;
  onClick: () => void;
  wide?: boolean;
  variant: ChoiceVariant;
}) {
  return (
    <button
      className={cn(choiceCardClassName, wide && choiceCardWideClassName)}
      title={`${label}. ${description}`}
      data-choice-variant={variant}
      type='button'
      onClick={onClick}
    >
      <span className='flex min-w-0 items-start gap-2'>
        <span
          aria-hidden='true'
          className='w-5 flex-none text-center text-base leading-none text-description'
        >
          {icon}
        </span>
        <span className='min-w-0 text-base/tight font-bold whitespace-normal text-ink'>
          {label}
        </span>
      </span>
      <span className='mt-1 max-w-full pl-7 text-left text-xs/tight font-normal whitespace-normal text-description'>
        {description}
      </span>
    </button>
  );
}
