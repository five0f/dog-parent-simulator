import { cn } from '../../lib/class-names';
import type { ChoiceVariant } from '../types';

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
      className={cn(
        'flex h-27.5 w-56 cursor-pointer flex-col items-center justify-center border-0 bg-transparent bg-(image:--choice-card) bg-size-[100%_100%] bg-center bg-no-repeat p-5 text-center text-ink hover:brightness-[1.06] focus-visible:brightness-[1.06] focus-visible:outline-none active:brightness-[0.98] max-[1200px]:w-72 max-[900px]:h-29.5 max-[900px]:w-55 max-[900px]:flex-[0_0_220px] max-[900px]:snap-center max-[900px]:scroll-ml-4 max-[900px]:p-3.5 max-[900px]:pb-3',
        wide && 'w-76.5 max-[900px]:w-55'
      )}
      data-choice-variant={variant}
      type='button'
      onClick={onClick}
    >
      <span className='flex items-center justify-center gap-3'>
        <span
          aria-hidden='true'
          className='w-6.5 flex-none text-center text-2xl leading-none text-description max-[900px]:text-[22px]'
        >
          {icon}
        </span>
        <span className='min-w-0 text-2xl leading-[1.08] font-bold wrap-anywhere text-ink max-[900px]:text-lg'>
          {label}
        </span>
      </span>
      <span className='mt-2.5 max-w-full text-center text-sm leading-[1.12] font-normal wrap-anywhere text-description max-[900px]:mt-2 max-[900px]:text-[13px]'>
        {description}
      </span>
    </button>
  );
}
