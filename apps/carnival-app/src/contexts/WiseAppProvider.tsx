import { useMemo, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { WiseAppContext } from 'wise-ui';

const copy = {
  filtros: 'Filtros',
  emptyTitle: 'Nenhum item',
  emptyDescription: 'Tente ajustar os filtros',
};

export function WiseAppProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const value = useMemo(
    () => ({
      nav: {
        isActive: (path: string) =>
          location.pathname === path ||
          (location.pathname.startsWith('/event/') &&
            (location.state as { from?: string } | null)?.from === path),
      },
      copy,
    }),
    [location.pathname, location.state]
  );
  return (
    <WiseAppContext.Provider value={value}>{children}</WiseAppContext.Provider>
  );
}
