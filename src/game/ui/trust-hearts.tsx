import { cn } from '../../lib/class-names';
import { getTrustHeartCount } from '../presentation/dog-status';

export function TrustHearts({ value }: { value: number }) {
  const filled = getTrustHeartCount(value);

  return (
    <div
      className='flex gap-2 max-md:gap-1.5 max-xs:gap-1'
      aria-label={`Доверие: ${String(filled)} из 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          aria-hidden='true'
          className={cn(
            'block size-7 bg-contain bg-center bg-no-repeat max-md:size-5 max-xs:size-4',
            index < filled ? 'bg-(image:--heart-full)' : 'bg-heart-empty heart-empty-mask'
          )}
          key={index}
        />
      ))}
    </div>
  );
}
