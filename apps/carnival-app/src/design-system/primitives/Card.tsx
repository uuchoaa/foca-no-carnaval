import type { ReactNode } from 'react';
import clsx from 'clsx';

type CardVariant = 'default' | 'highlight' | 'muted';

interface CardProps {
  variant?: CardVariant;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white shadow-md',
  highlight: 'bg-white shadow-lg border border-carnival-orange/20',
  muted: 'bg-gray-50 shadow-sm',
};

export function Card({ variant = 'default', children }: CardProps) {
  return (
    <div className={clsx('rounded-lg p-4', variantClasses[variant])}>
      {children}
    </div>
  );
}
