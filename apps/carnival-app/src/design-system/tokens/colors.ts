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

export const eventVariant = {
  bloco: base.orange,
  show: base.purple,
} as const;
