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
    <section className={cn('grid gap-2', compact ? 'mt-3' : 'mt-4')}>
      <h3 className='m-0 text-2xl leading-none font-bold text-ink max-xs:text-xl'>{title}</h3>
      {children}
    </section>
  );
}
