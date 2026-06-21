import type { ReactNode } from 'react';

export function TraitItem({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <li className='pl-1 text-lg/snug font-normal text-ink marker:text-ink-soft' title={title}>
      {children}
    </li>
  );
}
