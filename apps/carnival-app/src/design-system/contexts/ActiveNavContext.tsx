import { createContext, useContext } from 'react';

export interface ActiveNavContextValue {
  isActive: (path: string) => boolean;
}

const ActiveNavContext = createContext<ActiveNavContextValue | null>(null);

export function useActiveNav(): ActiveNavContextValue {
  const value = useContext(ActiveNavContext);
  if (value == null) {
    throw new Error('useActiveNav must be used within an ActiveNavProvider');
  }
  return value;
}

export { ActiveNavContext };
