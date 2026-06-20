import { cn } from '../../lib/class-names';
import { getTrustHeartCount } from '../presentation/dog-status';

export function TrustHearts({ value }: { value: number }) {
  const filled = getTrustHeartCount(value);

  return (
    <div
      className='flex gap-3 max-[900px]:gap-1.25 max-[520px]:gap-0.75'
      aria-label={`Доверие: ${String(filled)} из 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          aria-hidden='true'
          className={cn(
            'block size-7.5 bg-contain bg-center bg-no-repeat max-[900px]:size-5.5 max-[520px]:size-4',
            index < filled
              ? 'bg-(image:--heart-full)'
              : 'bg-[#ccac85] mask-(--heart-empty) mask-contain mask-center mask-no-repeat [-webkit-mask-image:var(--heart-empty)] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]'
          )}
          key={index}
        />
      ))}
    </div>
  );
}
