/** Single source of truth for palette. Align with tailwind.config.js */
export const carnival = {
  yellow: '#FFD700',
  orange: '#FF8C00',
  purple: '#9370DB',
  pink: '#FF69B4',
  green: '#32CD32',
} as const;

export const semantic = {
  primary: carnival.orange,
  secondary: carnival.purple,
  accent: carnival.yellow,
  success: carnival.green,
} as const;

export const eventVariant = {
  bloco: carnival.orange,
  show: carnival.purple,
} as const;
