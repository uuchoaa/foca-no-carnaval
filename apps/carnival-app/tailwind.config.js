/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'font-display',
    'font-sans',
    'bg-gradient-to-r',
    'from-orange',
    'to-yellow',
    'from-purple',
    'to-purple-600',
    'from-red-500',
    'to-pink-500',
    'text-white',
    'p-6',
    'shadow-lg',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        sans: ['Nunito', 'sans-serif'],
      },
      colors: {
        carnival: {
          yellow: '#FFD700',
          orange: '#FF8C00',
          purple: '#9370DB',
          pink: '#FF69B4',
          green: '#32CD32',
        }
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
      }
    },
  },
  plugins: [],
}
