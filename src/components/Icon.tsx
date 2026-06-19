import type { ImgHTMLAttributes } from 'react';
import iconFood from '../assets/ui/icons/icon-food.png';
import iconPlay from '../assets/ui/icons/icon-play.png';
import iconStress from '../assets/ui/icons/icon-stress.png';
import iconTraining from '../assets/ui/icons/icon-training.png';
import iconTrust from '../assets/ui/icons/icon-trust.png';
import iconWalk from '../assets/ui/icons/icon-walk.png';

const iconAssets = {
  energy: iconPlay,
  food: iconFood,
  play: iconPlay,
  stress: iconStress,
  training: iconTraining,
  trust: iconTrust,
  walk: iconWalk,
};

export type IconName = keyof typeof iconAssets;

interface IconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  name: IconName;
  size?: number;
}

export default function Icon({ name, size = 32, alt, style, ...props }: IconProps) {
  return (
    <img
      {...props}
      src={iconAssets[name]}
      alt={alt ?? ''}
      aria-hidden={alt ? undefined : true}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'inline-block',
        ...style,
      }}
    />
  );
}
