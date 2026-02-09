import { useMemo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ActiveNavContext } from '../design-system';

export function ActiveNavProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const value = useMemo(
    () => ({
      isActive: (path: string) =>
        location.pathname === path ||
        (location.pathname.startsWith('/event/') &&
          (location.state as { from?: string } | null)?.from === path),
    }),
    [location.pathname, location.state]
  );
  return (
    <ActiveNavContext.Provider value={value}>{children}</ActiveNavContext.Provider>
  );
}
