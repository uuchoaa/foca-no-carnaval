import type { ReactNode } from 'react';

interface ShowProps {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Show({ condition, children, fallback = null }: ShowProps) {
  return condition ? <>{children}</> : <>{fallback}</>;
}
