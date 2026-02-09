import type { ReactNode } from 'react';
import clsx from 'clsx';
import { semantic } from '../tokens/colors';

type CardVariant = 'default' | 'highlight' | 'muted';

interface CardProps {
  variant?: CardVariant;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white shadow-md',
  highlight: 'bg-white shadow-lg border',
  muted: 'bg-gray-50 shadow-sm',
};

/** 20% opacity in hex */
const highlightBorderStyle = { borderColor: `${semantic.primary}33` };

export function Card({ variant = 'default', children }: CardProps) {
  return (
    <div
      className={clsx('rounded-lg p-4', variantClasses[variant])}
      style={variant === 'highlight' ? highlightBorderStyle : undefined}
    >
      {children}
    </div>
  );
}
