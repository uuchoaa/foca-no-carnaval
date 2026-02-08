import { useState, useMemo } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { groupByDate, formatDate } from '../utils/dateHelpers';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import BlocoFilterPanel from '../components/BlocoFilterPanel';
import DateFilter from '../components/DateFilter';
import BlocoCard from '../components/BlocoCard';
import type { BlocoFilters, Bloco, Event } from '../types/events';
import { Text } from '../design-system';

export default function BlocosHomeScreen() {
  const { getBlocos, loading, blocos: allBlocos } = useEvents();
  const { isFavorite } = useFavorites();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<BlocoFilters>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const allDates = useMemo(
    () => [...new Set(allBlocos.map((b) => b.date))].sort(),
    [allBlocos]
  );

  const dateFilter = selectedDate
    ? { dateFrom: selectedDate, dateTo: selectedDate }
    : {};
  let blocos = getBlocos({ ...filters, ...dateFilter, search });
  if (filters.favoritesOnly) {
    blocos = blocos.filter((b) => isFavorite(b.id));
  }
  const groupedBlocos = groupByDate(blocos as Event[]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="bg-gradient-to-r from-carnival-orange to-carnival-yellow text-white p-6 shadow-lg">
        <Text variant="heading1" className="!text-white">
          Blocos
        </Text>
        <p className="text-sm mt-1 opacity-90">
          {blocos.length} bloco{blocos.length !== 1 ? 's' : ''} encontrado
          {blocos.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="p-4 space-y-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar blocos..." />
        <DateFilter
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          dates={allDates}
        />
        <BlocoFilterPanel filters={filters} onFilterChange={setFilters} />
      </div>

      <div className="px-4 pb-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-carnival-orange mx-auto" />
            <p className="text-gray-500 mt-4">Carregando...</p>
          </div>
        ) : groupedBlocos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">Nenhum bloco encontrado</p>
            <p className="text-gray-400 text-sm mt-2">Tente ajustar os filtros ou busca</p>
          </motion.div>
        ) : (
          groupedBlocos.map(({ date, dayOfWeek, events }) => (
            <div key={date} className="mb-6">
              <div className="mb-3">
                <h2 className="text-xl font-bold text-gray-900 capitalize">
                  {formatDate(date)}
                </h2>
                <p className="text-sm text-gray-500 capitalize">{dayOfWeek}</p>
              </div>
              <div className="space-y-3">
                {(events as Bloco[]).map((bloco, idx) => (
                  <BlocoCard key={bloco.id} bloco={bloco} index={idx} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
