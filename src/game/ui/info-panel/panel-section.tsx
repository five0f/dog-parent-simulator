import type { ReactNode } from 'react';

import { cn } from '../../../lib/class-names';

export function PanelSection({
  children,
  compact = false,
  title,
}: {
  children: ReactNode;
  compact?: boolean;
  title: string;
}) {
  return (
    <section className={cn('grid gap-2.5', compact ? 'mt-4' : 'mt-5')}>
      <h3 className='m-0 text-2xl leading-none font-bold text-ink max-[520px]:text-[22px]'>
        {title}
      </h3>
      {children}
    </section>
  );
}
