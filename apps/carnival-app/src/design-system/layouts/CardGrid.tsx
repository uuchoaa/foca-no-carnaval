import type { ReactNode } from 'react';
import clsx from 'clsx';

interface CardGridProps {
  children: ReactNode;
  className?: string;
}

export function CardGrid({ children, className }: CardGridProps) {
  return (
    <div
      className={clsx(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5',
        className
      )}
    >
      {children}
    </div>
  );
}
