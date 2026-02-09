import type { ReactNode, CSSProperties } from 'react';
import { typography } from '../tokens/typography';

type TextVariant = keyof typeof typography;

interface TextProps {
  variant?: TextVariant;
  children: ReactNode;
  style?: CSSProperties;
}

export function Text({ variant = 'body', children, style }: TextProps) {
  return <span className={typography[variant]} style={style}>{children}</span>;
}
