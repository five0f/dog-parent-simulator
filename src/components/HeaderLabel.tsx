import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import headerLabel from '../assets/ui/labels/header-label.png';

interface HeaderLabelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  contentStyle?: CSSProperties;
}

export default function HeaderLabel({ children, style, contentStyle, ...props }: HeaderLabelProps) {
  return (
    <div
      {...props}
      style={{
        position: 'relative',
        width: 232,
        maxWidth: '100%',
        aspectRatio: '465 / 160',
        display: 'grid',
        placeItems: 'center',
        backgroundImage: `url(${headerLabel})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        ...style,
      }}
    >
      <span
        style={{
          padding: '10px 22px',
          color: 'inherit',
          font: 'inherit',
          fontWeight: 900,
          textAlign: 'center',
          lineHeight: 1.05,
          ...contentStyle,
        }}
      >
        {children}
      </span>
    </div>
  );
}
