import type { ButtonHTMLAttributes, ReactNode } from 'react';
import buttonPanel from '../assets/ui/cards/button.png';

type ButtonVariant = 'positive' | 'neutral' | 'negative';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const buttonColors: Record<ButtonVariant, string> = {
  positive: '#6d2a21',
  neutral: '#2b1b12',
  negative: '#8a3a25',
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
        color: buttonColors[variant],
        font: 'inherit',
        fontWeight: 900,
        lineHeight: 1,
        textAlign: 'center',
        backgroundColor: 'transparent',
        backgroundImage: `url(${buttonPanel})`,
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
