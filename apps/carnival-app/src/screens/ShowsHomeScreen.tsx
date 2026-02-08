import { useState, useMemo } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { groupByDate, formatDate } from '../utils/dateHelpers';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import ShowFilterPanel from '../components/ShowFilterPanel';
import DateFilter from '../components/DateFilter';
import ShowCard from '../components/ShowCard';
import type { ShowFilters, Show, Event } from '../types/events';
import { Text } from '../design-system';

export default function ShowsHomeScreen() {
  const { getShows, loading, shows: allShows } = useEvents();
  const { isFavorite } = useFavorites();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ShowFilters>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const allDates = useMemo(
    () => [...new Set(allShows.map((s) => s.date))].sort(),
    [allShows]
  );

  const dateFilter = selectedDate
    ? { dateFrom: selectedDate, dateTo: selectedDate }
    : {};
  let shows = getShows({ ...filters, ...dateFilter, search });
  if (filters.favoritesOnly) {
    shows = shows.filter((s) => isFavorite(s.id));
  }
  const groupedShows = groupByDate(shows as Event[]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="bg-gradient-to-r from-carnival-purple to-purple-600 text-white p-6 shadow-lg">
        <Text variant="heading1" className="!text-white">
          Shows
        </Text>
        <p className="text-sm mt-1 opacity-90">
          {shows.length} show{shows.length !== 1 ? 's' : ''} encontrado
          {shows.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="p-4 space-y-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar shows, artistas..."
        />
        <DateFilter
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          dates={allDates}
          variant="purple"
        />
        <ShowFilterPanel filters={filters} onFilterChange={setFilters} />
      </div>

      <div className="px-4 pb-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-carnival-purple mx-auto" />
            <p className="text-gray-500 mt-4">Carregando...</p>
          </div>
        ) : groupedShows.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">Nenhum show encontrado</p>
            <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros ou busca</p>
          </motion.div>
        ) : (
          groupedShows.map(({ date, dayOfWeek, events }) => (
            <div key={date} className="mb-6">
              <div className="mb-3">
                <h2 className="text-xl font-bold text-gray-900 capitalize">
                  {formatDate(date)}
                </h2>
                <p className="text-sm text-gray-500 capitalize">{dayOfWeek}</p>
              </div>
              <div className="space-y-3">
                {(events as Show[]).map((show, idx) => (
                  <ShowCard key={show.id} show={show} index={idx} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
