import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { FavoritesContextValue } from '../types/events';

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const STORAGE_KEY = 'carnival-favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const addFavorite = (eventId: string) => {
    setFavorites((prev) => (prev.includes(eventId) ? prev : [...prev, eventId]));
  };

  const removeFavorite = (eventId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== eventId));
  };

  const toggleFavorite = (eventId: string) => {
    setFavorites((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const isFavorite = (eventId: string) => favorites.includes(eventId);
  const clearFavorites = () => setFavorites([]);

  const value: FavoritesContextValue = {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
