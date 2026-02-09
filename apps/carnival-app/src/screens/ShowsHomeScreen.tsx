import { useState, useMemo } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { groupByDate, formatDate } from '../utils/dateHelpers';
import { motion } from 'framer-motion';
import ShowFilterPanel from '../components/ShowFilterPanel';
import DateFilter from '../components/DateFilter';
import ShowCard from '../components/ShowCard';
import type { ShowFilters, Show, Event } from '../types/events';
import {
  Page,
  FilterBar,
  CardGrid,
  SearchBarWithIcon,
  LoadingSpinner,
  EmptyState,
  SectionHeading,
  Divider,
} from '../design-system';

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
    >
      <Page>
        <Page.Header
          gradient="shows"
          title="Shows"
          subtitle={`${shows.length} show${shows.length !== 1 ? 's' : ''} encontrado${shows.length !== 1 ? 's' : ''}`}
        />
        <FilterBar>
          <SearchBarWithIcon
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
        </FilterBar>
        <Page.Content>
          {loading ? (
            <LoadingSpinner variant="purple" />
          ) : groupedShows.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="py-12"
            >
              <EmptyState
                title="Nenhum show encontrado"
                description="Tente ajustar os filtros ou busca"
                className="py-12"
              />
            </motion.div>
          ) : (
            groupedShows.map(({ date, dayOfWeek, events }, sectionIdx) => (
              <div key={date}>
                {sectionIdx > 0 && <Divider />}
                <div className="mb-8">
                  <div className="mb-4">
                    <SectionHeading title={formatDate(date)} subtitle={dayOfWeek} />
                  </div>
                  <CardGrid>
                    {(events as Show[]).map((show, idx) => (
                      <ShowCard key={show.id} show={show} index={idx} />
                    ))}
                  </CardGrid>
                </div>
              </div>
            ))
          )}
        </Page.Content>
      </Page>
    </motion.div>
  );
}
