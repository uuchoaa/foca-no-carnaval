export interface Source {
  id: string;
  originalId?: string;
  url?: string;
  extractedAt?: string;
}

export interface Location {
  venue?: string | null;
  address?: string | null;
  raw: string;
}

export interface Bloco {
  id: string;
  eventType: 'bloco';
  name: string;
  date: string;
  concentration: { time: string; dateTime: string };
  departure: { time: string; dateTime: string };
  city: 'recife' | 'olinda';
  location: Location;
  tags?: string[];
  artist?: string;
  description?: string;
  isFree?: boolean;
  sources?: Source[];
}

export interface Show {
  id: string;
  eventType: 'show';
  name: string;
  date: string;
  showTime: string;
  dateTime: string;
  artist: string;
  artistOrigin: string;
  pole: string;
  city: 'recife' | 'olinda';
  location: Location;
  tags?: string[];
  description?: string;
  isFree?: boolean;
  sources?: Source[];
}

export type Event = Bloco | Show;

export interface BlocoFilters {
  city?: string[];
  tags?: string[];
  hasArtist?: boolean;
  favoritesOnly?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ShowFilters {
  city?: string[];
  pole?: string[];
  artistOrigin?: string[];
  tags?: string[];
  favoritesOnly?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface EventsContextValue {
  blocos: Bloco[];
  shows: Show[];
  loading: boolean;
  getAllEvents: () => Event[];
  getBlocos: (filters?: BlocoFilters) => Bloco[];
  getShows: (filters?: ShowFilters) => Show[];
  getEventById: (id: string) => Event | undefined;
  getPoles: () => string[];
  getArtistOrigins: () => string[];
  getBlocoTags: () => string[];
  getShowTags: () => string[];
}

export interface FavoritesContextValue {
  favorites: string[];
  addFavorite: (eventId: string) => void;
  removeFavorite: (eventId: string) => void;
  toggleFavorite: (eventId: string) => void;
  isFavorite: (eventId: string) => boolean;
  clearFavorites: () => void;
  count: number;
}

export interface GroupedByDate {
  date: string;
  dayOfWeek: string;
  events: Event[];
}
