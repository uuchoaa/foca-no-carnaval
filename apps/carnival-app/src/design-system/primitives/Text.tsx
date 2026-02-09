import type { ReactNode } from 'react';
import { typography } from '../tokens/typography';

type TextVariant = keyof typeof typography;

interface TextProps {
  variant?: TextVariant;
  children: ReactNode;
}

export function Text({ variant = 'body', children }: TextProps) {
  return <span className={typography[variant]}>{children}</span>;
}
