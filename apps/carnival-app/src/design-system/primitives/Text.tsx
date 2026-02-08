import type { ReactNode } from 'react';
import clsx from 'clsx';
import { typography } from '../tokens/typography';

type TextVariant = keyof typeof typography;

interface TextProps {
  variant?: TextVariant;
  children: ReactNode;
  className?: string;
}

export function Text({ variant = 'body', children, className }: TextProps) {
  return <span className={clsx(typography[variant], className)}>{children}</span>;
}
