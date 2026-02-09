import { createContext, useContext } from 'react';

export interface WiseAppNav {
  isActive: (path: string) => boolean;
}

export interface WiseAppCopy {
  filtros: string;
  emptyTitle: string;
  emptyDescription: string;
}

export interface WiseAppContextValue {
  nav: WiseAppNav;
  copy: WiseAppCopy;
}

const WiseAppContext = createContext<WiseAppContextValue | null>(null);

export function useWiseAppNav(): WiseAppNav {
  const value = useContext(WiseAppContext);
  if (value == null) {
    throw new Error('useWiseAppNav must be used within WiseAppProvider');
  }
  return value.nav;
}

export function useWiseAppCopy(): WiseAppCopy {
  const value = useContext(WiseAppContext);
  if (value == null) {
    throw new Error('useWiseAppCopy must be used within WiseAppProvider');
  }
  return value.copy;
}

export function useWiseApp(): WiseAppContextValue {
  const value = useContext(WiseAppContext);
  if (value == null) {
    throw new Error('useWiseApp must be used within WiseAppProvider');
  }
  return value;
}

export { WiseAppContext };
