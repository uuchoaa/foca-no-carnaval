export const pageHeaderGradients = {
  blocos: 'bg-gradient-to-r from-carnival-orange to-carnival-yellow text-white p-6 shadow-lg',
  shows: 'bg-gradient-to-r from-carnival-purple to-purple-600 text-white p-6 shadow-lg',
  map: 'bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 shadow-lg',
  favorites: 'bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 shadow-lg',
  'event-bloco': 'bg-gradient-to-r from-carnival-orange to-carnival-yellow text-white p-6 shadow-lg',
  'event-show': 'bg-gradient-to-r from-carnival-purple to-purple-600 text-white p-6 shadow-lg',
} as const;

export type PageHeaderGradient = keyof typeof pageHeaderGradients;
