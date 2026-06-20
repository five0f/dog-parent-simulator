import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import dialogPanel from '../assets/ui/cards/dialog-panel.png';

type CardVariant = 'large' | 'medium' | 'small';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children?: ReactNode;
  contentStyle?: CSSProperties;
}

const cardAssets: Record<CardVariant, { width: number; height: number; padding: string }> = {
  large: { width: 620, height: 360, padding: '32px 38px' },
  medium: { width: 420, height: 260, padding: '28px 32px' },
  small: { width: 300, height: 160, padding: '22px 26px' },
};

export default function Card({ variant = 'medium', children, style, contentStyle, ...props }: CardProps) {
  const asset = cardAssets[variant];

  return (
    <div
      {...props}
      style={{
        position: 'relative',
        width: asset.width,
        maxWidth: '100%',
        aspectRatio: `${asset.width} / ${asset.height}`,
        background: 'transparent',
        borderStyle: 'solid',
        borderWidth: 42,
        borderImageSource: `url(${dialogPanel})`,
        borderImageSlice: '56 fill',
        borderImageWidth: 42,
        ...style,
      }}
    >
      <div
        style={{
          boxSizing: 'border-box',
          width: '100%',
          height: '100%',
          padding: asset.padding,
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
