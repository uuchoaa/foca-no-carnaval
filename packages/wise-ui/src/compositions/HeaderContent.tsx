import type { ReactNode } from 'react';

export function HeaderContent({ children }: { children: ReactNode }) {
  return <div style={{ paddingTop: '48px' }}>{children}</div>;
}
