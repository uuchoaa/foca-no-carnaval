/** Single source of truth for palette. Align with tailwind.config.js */
export const base = {
  yellow: '#FFD700',
  orange: '#FF8C00',
  purple: '#9370DB',
  pink: '#FF69B4',
  green: '#32CD32',
} as const;

export const semantic = {
  primary: base.orange,
  secondary: base.purple,
  accent: base.yellow,
  success: base.green,
} as const;

/** Text color tokens (Tailwind classes). Use via Text color prop. */
export const textColor = {
  primary: 'text-gray-900',
  muted: 'text-gray-500',
  secondary: 'text-gray-600',
  inverse: 'text-white',
} as const;

export type TextColor = keyof typeof textColor;
