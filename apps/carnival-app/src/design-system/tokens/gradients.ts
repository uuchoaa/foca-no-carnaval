export const pageHeaderGradients = {
  blocos: 'from-carnival-orange to-carnival-yellow',
  shows: 'from-carnival-purple to-purple-600',
  map: 'from-blue-500 to-green-500',
  favorites: 'from-red-500 to-pink-500',
  calendar: 'from-carnival-orange via-carnival-yellow to-carnival-purple',
  'event-bloco': 'from-carnival-orange to-carnival-yellow',
  'event-show': 'from-carnival-purple to-purple-600',
} as const;

export type PageHeaderGradient = keyof typeof pageHeaderGradients;
