/** Typography variants: size + weight + font role. No color—use Text color prop. */
export const typography = {
  hero: 'text-3xl font-bold font-hero',
  title: 'text-xl font-bold font-display leading-tight',
  body: 'text-base font-sans',
  small: 'text-sm font-sans',
  chip: 'text-sm block mb-3 font-medium font-sans',
  caption: 'text-xs font-sans',
  subtitle: 'capitalize font-sans',
} as const;
