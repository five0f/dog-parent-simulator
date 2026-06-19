import type { ButtonHTMLAttributes, ReactNode } from 'react';
import buttonNegative from '../assets/ui/buttons/button-negative.png';
import buttonNeutral from '../assets/ui/buttons/button-neutral.png';
import buttonPositive from '../assets/ui/buttons/button-positive.png';

type ButtonVariant = 'positive' | 'neutral' | 'negative';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const buttonAssets: Record<ButtonVariant, string> = {
  positive: buttonPositive,
  neutral: buttonNeutral,
  negative: buttonNegative,
};

export default function Button({ variant = 'neutral', children, style, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      style={{
        minWidth: 172,
        minHeight: 48,
        display: 'inline-grid',
        placeItems: 'center',
        padding: '12px 28px',
        color: 'inherit',
        font: 'inherit',
        fontWeight: 900,
        lineHeight: 1,
        textAlign: 'center',
        backgroundColor: 'transparent',
        backgroundImage: `url(${buttonAssets[variant]})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        border: 0,
        cursor: props.disabled ? 'default' : 'pointer',
        ...style,
      }}
    >
      <span>{children}</span>
    </button>
  );
}
