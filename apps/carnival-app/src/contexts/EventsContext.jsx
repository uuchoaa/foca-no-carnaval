import { createContext, useContext, useState, useEffect } from 'react';
import blocosData from '../data/blocos.json';
import showsData from '../data/shows.json';

const EventsContext = createContext();

export function EventsProvider({ children }) {
  const [blocos, setBlocos] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setBlocos(blocosData);
      setShows(showsData);
      setLoading(false);
    }, 100);
  }, []);

  const getAllEvents = () => {
    return [...blocos, ...shows].sort((a, b) => {
      const dateA = new Date(a.concentration?.dateTime || a.dateTime);
      const dateB = new Date(b.concentration?.dateTime || b.dateTime);
      return dateA - dateB;
    });
  };

  const getBlocos = (filters = {}) => {
    let filtered = [...blocos];

    // Filter by city
    if (filters.city && filters.city.length > 0) {
      filtered = filtered.filter(b => filters.city.includes(b.city));
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(b => new Date(b.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(b => new Date(b.date) <= new Date(filters.dateTo));
    }

    // Filter by has artist
    if (filters.hasArtist) {
      filtered = filtered.filter(b => b.artist);
    }

    // Search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(search) ||
        (b.artist && b.artist.toLowerCase().includes(search)) ||
        b.location.raw.toLowerCase().includes(search)
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.concentration.dateTime);
      const dateB = new Date(b.concentration.dateTime);
      return dateA - dateB;
    });
  };

  const getShows = (filters = {}) => {
    let filtered = [...shows];

    // Filter by city
    if (filters.city && filters.city.length > 0) {
      filtered = filtered.filter(s => filters.city.includes(s.city));
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(s => new Date(s.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(s => new Date(s.date) <= new Date(filters.dateTo));
    }

    // Filter by artist origin
    if (filters.artistOrigin && filters.artistOrigin.length > 0) {
      filtered = filtered.filter(s => filters.artistOrigin.includes(s.artistOrigin));
    }

    // Filter by pole
    if (filters.pole && filters.pole.length > 0) {
      filtered = filtered.filter(s => filters.pole.includes(s.pole));
    }

    // Search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(search) ||
        s.artist.toLowerCase().includes(search) ||
        s.pole.toLowerCase().includes(search) ||
        s.location.raw.toLowerCase().includes(search)
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.dateTime);
      const dateB = new Date(b.dateTime);
      return dateA - dateB;
    });
  };

  const getEventById = (id) => {
    return [...blocos, ...shows].find(e => e.id === id);
  };

  // Get all unique poles for filter
  const getPoles = () => {
    return [...new Set(shows.map(s => s.pole))].sort();
  };

  // Get all unique artist origins for filter
  const getArtistOrigins = () => {
    return [...new Set(shows.map(s => s.artistOrigin))].sort();
  };

  const value = {
    blocos,
    shows,
    loading,
    getAllEvents,
    getBlocos,
    getShows,
    getEventById,
    getPoles,
    getArtistOrigins,
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within EventsProvider');
  }
  return context;
}
