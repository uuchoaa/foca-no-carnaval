export const pageHeaderGradients = {
  sunny: 'bg-gradient-to-r from-orange to-yellow text-white p-6 shadow-lg',
  haze: 'bg-gradient-to-r from-purple to-purple-600 text-white p-6 shadow-lg',
  love: 'bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 shadow-lg',
} as const;

export type PageHeaderGradient = keyof typeof pageHeaderGradients;
