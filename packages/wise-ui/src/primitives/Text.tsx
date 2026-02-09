import { createElement, type ReactNode } from 'react';
import clsx from 'clsx';
import { typography } from '../tokens/typography';
import { textColor, type TextColor } from '../tokens/colors';

type TextVariant = keyof typeof typography;

const defaultColorByVariant: Partial<Record<TextVariant, TextColor>> = {
  subtitle: 'muted',
  chip: 'secondary',
};

interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  children: ReactNode;
}

const variantElement: Record<TextVariant, string> = {
  hero: 'h1',
  title: 'h2',
  subtitle: 'p',
  body: 'p',
  small: 'span',
  chip: 'span',
  caption: 'span',
};

export function Text({
  variant = 'body',
  color,
  children,
}: TextProps) {
  const resolvedColor = color ?? defaultColorByVariant[variant] ?? 'primary';
  const className = clsx(
    typography[variant],
    textColor[resolvedColor]
  );
  return createElement(variantElement[variant], { className }, children);
}
