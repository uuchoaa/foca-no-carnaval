/** Tailwind class names for header (padding, shadow, text). Use with pageHeaderGradientBg for background. */
export const pageHeaderGradients = {
  sunny: 'text-white p-6 shadow-lg',
  haze: 'text-white p-6 shadow-lg',
  love: 'text-white p-6 shadow-lg',
} as const;

export type PageHeaderGradient = keyof typeof pageHeaderGradients;

/** CSS linear-gradient for header background (avoids Tailwind purge). */
export const pageHeaderGradientBg: Record<PageHeaderGradient, string> = {
  sunny: 'linear-gradient(to right, #FF8C00, #FFD700)',
  haze: 'linear-gradient(to right, #9370DB, #7B68EE)',
  love: 'linear-gradient(to right, #ef4444, #ec4899)',
};
