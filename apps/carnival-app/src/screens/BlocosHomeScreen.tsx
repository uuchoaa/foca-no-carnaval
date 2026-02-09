import { useState, useMemo } from 'react';
import { Clock, Heart, MapPin, Search, X, Filter } from 'lucide-react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import type { Bloco } from '../types/events';
import { groupByDate, formatDate, formatDateChip } from '../utils/dateHelpers';
import { Page, Text, Card, CardGrid, Badge, VStack, HStack, SectionHeading, Divider, IconLabel, FavButton, DateChipRow, SearchBarWithIcon, FilterPanel, ChipGroup, CheckboxField } from '../design-system';

export default function BlocosHomeScreen() {
  const { getBlocos, getBlocoTags, loading } = useEvents();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hasArtist, setHasArtist] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const cityOptions = useMemo(
    () => [
      { id: 'recife', label: 'Recife', color: 'blue' as const },
      { id: 'olinda', label: 'Olinda', color: 'purple' as const },
    ],
    []
  );
  const tagOptions = useMemo(
    () => getBlocoTags().map((t) => ({ id: t, label: t })),
    [getBlocoTags]
  );

  const filters = useMemo(() => {
    const f: { dateFrom?: string; dateTo?: string; search?: string; city?: string[]; tags?: string[]; hasArtist?: boolean } = {};
    if (selectedDate) {
      f.dateFrom = selectedDate;
      f.dateTo = selectedDate;
    }
    if (search.trim()) f.search = search.trim();
    if (selectedCities.length) f.city = selectedCities;
    if (selectedTags.length) f.tags = selectedTags;
    if (hasArtist) f.hasArtist = true;
    return f;
  }, [selectedDate, search, selectedCities, selectedTags, hasArtist]);

  const allBlocos = getBlocos({});
  let blocos = getBlocos(filters);
  if (favoritesOnly) blocos = blocos.filter((b) => isFavorite(b.id));

  const activeFilterCount = selectedCities.length + selectedTags.length + (hasArtist ? 1 : 0) + (favoritesOnly ? 1 : 0);

  const toggleCity = (id: string) => {
    setSelectedCities((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };
  const toggleTag = (id: string) => {
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const dateChipItems = useMemo(() => {
    const dates = [...new Set(allBlocos.map((b) => b.date))].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    return [
      { id: null as string | null, label: 'Todos' },
      ...dates.map((d) => {
        const { short, day } = formatDateChip(d);
        return { id: d, label: day, sublabel: short };
      }),
    ];
  }, [allBlocos]);

  const groupedByDate = useMemo(() => groupByDate(blocos), [blocos]);

  return (
    <Page>
      <Page.Header gradient="sunny">
        <Text variant="hero" color="inverse">Blocos</Text>
        <Text variant="subtitle" color="inverse">{blocos.length} blocos encontrados</Text>
      </Page.Header>
      <Page.Content isLoading={loading} isEmpty={blocos.length === 0}>
        <VStack gap={16} align="stretch">
          <SearchBarWithIcon
            icon={Search}
            clearIcon={X}
            value={search}
            onChange={setSearch}
            placeholder="Buscar blocos..."
          />
          <DateChipRow
            label="Data"
            items={dateChipItems}
            selectedId={selectedDate}
            onSelect={setSelectedDate}
          />
          <FilterPanel
            icon={Filter}
            isOpen={filterPanelOpen}
            onToggle={() => setFilterPanelOpen((o) => !o)}
            activeCount={activeFilterCount}
          >
            <ChipGroup
              label="Cidade"
              options={cityOptions}
              selectedIds={selectedCities}
              onToggle={toggleCity}
            />
            {tagOptions.length > 0 ? (
              <ChipGroup
                label="Tags"
                options={tagOptions}
                selectedIds={selectedTags}
                onToggle={toggleTag}
              />
            ) : null}
            <CheckboxField
              label="Apenas com artista"
              checked={hasArtist}
              onChange={setHasArtist}
            />
            <CheckboxField
              label="Apenas favoritos"
              checked={favoritesOnly}
              onChange={setFavoritesOnly}
            />
          </FilterPanel>
          {groupedByDate.map(({ date, dayOfWeek, events }) => (
            <section key={date}>
              <VStack gap={4} align="stretch">
                <SectionHeading
                  title={formatDate(date)}
                  subtitle={dayOfWeek}
                />
                <CardGrid>
                {(events as Bloco[]).map((bloco) => (
                  <Card key={bloco.id} interactive>
                    <VStack gap={2} align="start">
                      <HStack justify="between" align="center" gap={2} className="w-full min-w-0">
                        <div className="min-w-0 flex-1">
                          <Text variant="title">{bloco.name}</Text>
                        </div>
                        <div className="self-center flex-shrink-0">
                          <FavButton
                            icon={Heart}
                            isActive={isFavorite(bloco.id)}
                            onToggle={() => toggleFavorite(bloco.id)}
                            iconSize={20}
                          />
                        </div>
                        
                      </HStack>
                      <Badge color="blue">{bloco.city}</Badge>
                      <IconLabel icon={Clock} iconColor="primary">
                        <Text variant="small">
                          {bloco.concentration.time} / {bloco.departure.time}
                        </Text>
                      </IconLabel>
                      <IconLabel icon={MapPin} iconColor="muted">
                        <Text variant="caption">{bloco.location.raw}</Text>
                      </IconLabel>
                    </VStack>
                  </Card>
                ))}
                </CardGrid>
                <Divider />
              </VStack>
            </section>
          ))}
        </VStack>
      </Page.Content>
    </Page>
  );
}
