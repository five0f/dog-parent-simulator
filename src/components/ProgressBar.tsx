import type { HTMLAttributes } from 'react';

type ProgressTone = 'good' | 'warning' | 'danger';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  tone?: ProgressTone;
}

function getTone(value: number): ProgressTone {
  if (value >= 66) return 'good';
  if (value >= 34) return 'warning';
  return 'danger';
}

export default function ProgressBar({ value, max = 100, tone, className = '', ...props }: ProgressBarProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  const resolvedTone = tone ?? getTone(percent);

  return (
    <div {...props} className={`progress-bar ${className}`.trim()}>
      <span className={`progress-bar__fill progress-bar__fill--${resolvedTone}`} style={{ width: `${percent}%` }} />
    </div>
  );
}
