import { useState, useMemo } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { groupByDate } from '../utils/dateHelpers';
import type { BlocoFilters } from '../types/events';

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
  const groupedBlocos = groupByDate(blocos);

  return (

  );
}
