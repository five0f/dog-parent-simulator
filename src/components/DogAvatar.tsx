import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import dogAvatar from '../assets/ui/avatars/dog-avatar.png';

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
        aspectRatio: '1 / 1',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      {src || !children ? (
        <img
          src={src ?? dogAvatar}
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
      {!src && children ? (
        <img
          src={dogAvatar}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </div>
  );
}
