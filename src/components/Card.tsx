import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import cardLarge from '../assets/ui/cards/card-large.png';
import cardMedium from '../assets/ui/cards/card-medium.png';
import cardSmall from '../assets/ui/cards/card-small.png';

type CardVariant = 'large' | 'medium' | 'small';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children?: ReactNode;
  contentStyle?: CSSProperties;
}

const cardAssets: Record<CardVariant, { src: string; width: number; height: number; padding: string }> = {
  large: { src: cardLarge, width: 400, height: 300, padding: '28px 30px' },
  medium: { src: cardMedium, width: 320, height: 223, padding: '22px 24px' },
  small: { src: cardSmall, width: 280, height: 105, padding: '16px 20px' },
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
        backgroundImage: `url(${asset.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
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
