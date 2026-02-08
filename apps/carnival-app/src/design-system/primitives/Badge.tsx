import type { ReactNode } from 'react';
import clsx from 'clsx';

type BadgeColor = 'orange' | 'purple' | 'blue' | 'green' | 'gray';

interface BadgeProps {
  color?: BadgeColor;
  children: ReactNode;
}

const colorClasses: Record<BadgeColor, string> = {
  orange: 'bg-orange-100 text-orange-700',
  purple: 'bg-purple-100 text-purple-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  gray: 'bg-gray-100 text-gray-700',
};

export function Badge({ color = 'gray', children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
        colorClasses[color]
      )}
    >
      {children}
    </span>
  );
}
