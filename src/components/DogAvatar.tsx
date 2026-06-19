import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import dogAvatarFrame from '../assets/ui/avatars/dog-avatar-frame.png';

interface DogAvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  children?: ReactNode;
  imageStyle?: CSSProperties;
}

export default function DogAvatar({ src, alt = 'Бублик', children, style, imageStyle, ...props }: DogAvatarProps) {
  return (
    <div
      {...props}
      style={{
        position: 'relative',
        width: 96,
        maxWidth: '100%',
        aspectRatio: '476 / 440',
        display: 'grid',
        placeItems: 'center',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '13% 15% 16%',
          zIndex: 2,
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              ...imageStyle,
            }}
          />
        ) : (
          children
        )}
      </div>
      <img
        src={dogAvatarFrame}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
