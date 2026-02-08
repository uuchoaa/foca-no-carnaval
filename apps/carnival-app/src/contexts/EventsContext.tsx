import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import blocosData from '../data/blocos.json';
import showsData from '../data/shows.json';
import type {
  Bloco,
  Show,
  Event,
  BlocoFilters,
  ShowFilters,
  EventsContextValue,
} from '../types/events';

const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setBlocos(blocosData as Bloco[]);
      setShows(showsData as Show[]);
      setLoading(false);
    }, 100);
  }, []);

  const getAllEvents = (): Event[] => {
    return ([...blocos, ...shows] as Event[]).sort((a, b) => {
      const dateA = new Date('concentration' in a ? a.concentration.dateTime : a.dateTime);
      const dateB = new Date('concentration' in b ? b.concentration.dateTime : b.dateTime);
      return dateA.getTime() - dateB.getTime();
    });
  };

  const getBlocos = (filters: BlocoFilters = {}): Bloco[] => {
    let filtered = [...blocos];

    if (filters.city?.length) {
      filtered = filtered.filter((b) => filters.city!.includes(b.city));
    }
    if (filters.dateFrom) {
      filtered = filtered.filter((b) => new Date(b.date) >= new Date(filters.dateFrom!));
    }
    if (filters.dateTo) {
      filtered = filtered.filter((b) => new Date(b.date) <= new Date(filters.dateTo!));
    }
    if (filters.hasArtist) {
      filtered = filtered.filter((b) => b.artist);
    }
    if (filters.tags?.length) {
      filtered = filtered.filter((b) => b.tags?.some((t) => filters.tags!.includes(t)));
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(search) ||
          (b.artist?.toLowerCase().includes(search)) ||
          b.location.raw.toLowerCase().includes(search)
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(a.concentration.dateTime).getTime() - new Date(b.concentration.dateTime).getTime()
    );
  };

  const getShows = (filters: ShowFilters = {}): Show[] => {
    let filtered = [...shows];

    if (filters.city?.length) {
      filtered = filtered.filter((s) => filters.city!.includes(s.city));
    }
    if (filters.dateFrom) {
      filtered = filtered.filter((s) => new Date(s.date) >= new Date(filters.dateFrom!));
    }
    if (filters.dateTo) {
      filtered = filtered.filter((s) => new Date(s.date) <= new Date(filters.dateTo!));
    }
    if (filters.artistOrigin?.length) {
      filtered = filtered.filter((s) => filters.artistOrigin!.includes(s.artistOrigin));
    }
    if (filters.pole?.length) {
      filtered = filtered.filter((s) => filters.pole!.includes(s.pole));
    }
    if (filters.tags?.length) {
      filtered = filtered.filter((s) => s.tags?.some((t) => filters.tags!.includes(t)));
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.artist.toLowerCase().includes(search) ||
          s.pole.toLowerCase().includes(search) ||
          s.location.raw.toLowerCase().includes(search)
      );
    }

    return filtered.sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );
  };

  const getEventById = (id: string): Event | undefined => {
    return ([...blocos, ...shows] as Event[]).find((e) => e.id === id);
  };

  const getPoles = (): string[] => [...new Set(shows.map((s) => s.pole))].sort();
  const getArtistOrigins = (): string[] => [...new Set(shows.map((s) => s.artistOrigin))].sort();
  const getBlocoTags = (): string[] => [...new Set(blocos.flatMap((b) => b.tags || []))].sort();
  const getShowTags = (): string[] => [...new Set(shows.flatMap((s) => s.tags || []))].sort();

  const value: EventsContextValue = {
    blocos,
    shows,
    loading,
    getAllEvents,
    getBlocos,
    getShows,
    getEventById,
    getPoles,
    getArtistOrigins,
    getBlocoTags,
    getShowTags,
  };

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents(): EventsContextValue {
  const context = useContext(EventsContext);
  if (!context) throw new Error('useEvents must be used within EventsProvider');
  return context;
}
