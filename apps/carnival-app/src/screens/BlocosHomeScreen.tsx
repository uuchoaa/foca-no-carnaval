import { useState, useMemo } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { groupByDate, formatDate } from '../utils/dateHelpers';
import BlocoFilterPanel from '../components/BlocoFilterPanel';
import DateFilter from '../components/DateFilter';
import BlocoCard from '../components/BlocoCard';
import type { BlocoFilters, Bloco, Event } from '../types/events';
import {
  Page,
  FilterBar,
  CardGrid,
  SearchBarWithIcon,
  SectionHeading,
  Divider,
} from '../design-system';

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
    <Page>
      <Page.Header
        gradient="blocos"
        title="Blocos"
        subtitle={`${blocos.length} bloco${blocos.length !== 1 ? 's' : ''} encontrado${blocos.length !== 1 ? 's' : ''}`}
      />
      <FilterBar>
        <SearchBarWithIcon value={search} onChange={setSearch} placeholder="Buscar blocos..." />
        <DateFilter
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          dates={allDates}
        />
        <BlocoFilterPanel filters={filters} onFilterChange={setFilters} />
      </FilterBar>
      <Page.Content isLoading={loading} loadingVariant="orange">
        {groupedBlocos.length === 0 ? (
          <Page.EmptyState
            title="Nenhum bloco encontrado"
            description="Tente ajustar os filtros ou busca"
          />
        ) : (
          groupedBlocos.map(({ date, dayOfWeek, events }, sectionIdx) => (
            <div key={date}>
              {sectionIdx > 0 && <Divider />}
              <div className="mb-8">
                <div className="mb-4">
                  <SectionHeading title={formatDate(date)} subtitle={dayOfWeek} />
                </div>
                <CardGrid>
                  {(events as Bloco[]).map((bloco, idx) => (
                    <BlocoCard key={bloco.id} bloco={bloco} index={idx} />
                  ))}
                </CardGrid>
              </div>
            </div>
          ))
        )}
      </Page.Content>
    </Page>
  );
}
