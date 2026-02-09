import type { ReactNode } from 'react';
import clsx from 'clsx';
import { semantic } from '../tokens/colors';

type CardVariant = 'default' | 'highlight' | 'muted';

interface CardProps {
  variant?: CardVariant;
  interactive?: boolean;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white shadow-md',
  highlight: 'bg-white shadow-lg border',
  muted: 'bg-gray-50 shadow-sm',
};

const interactiveClasses = 'transition-shadow duration-200 hover:shadow-lg';

/** 20% opacity in hex */
const highlightBorderStyle = { borderColor: `${semantic.primary}33` };

export function Card({ variant = 'default', interactive, children }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg p-4',
        variantClasses[variant],
        interactive && interactiveClasses
      )}
      style={variant === 'highlight' ? highlightBorderStyle : undefined}
    >
      {children}
    </div>
  );
}
