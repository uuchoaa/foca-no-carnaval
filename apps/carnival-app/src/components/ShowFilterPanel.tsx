import { useState } from 'react';
import { useEvents } from '../contexts/EventsContext';
import type { ShowFilters } from '../types/events';
import {
  FilterPanel,
  ChipGroup,
  CheckboxField,
  Button,
  type ChipOption,
} from '../design-system';

interface ShowFilterPanelProps {
  filters: ShowFilters;
  onFilterChange: (filters: ShowFilters) => void;
}

const cityOptions: ChipOption[] = [
  { id: 'recife', label: 'Recife', color: 'blue' },
  { id: 'olinda', label: 'Olinda', color: 'green' },
];

export default function ShowFilterPanel({ filters, onFilterChange }: ShowFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { getPoles, getArtistOrigins, getShowTags } = useEvents();
  const poles: ChipOption[] = getPoles().map((p) => ({ id: p, label: p, color: 'purple' }));
  const origins: ChipOption[] = getArtistOrigins().map((o) => ({
    id: o,
    label: o,
    color: 'purple',
  }));
  const tagOptions: ChipOption[] = getShowTags().map((t) => ({
    id: t,
    label: t,
    color: 'purple',
  }));

  const activeCount =
    (filters.city?.length ?? 0) +
    (filters.pole?.length ?? 0) +
    (filters.artistOrigin?.length ?? 0) +
    (filters.tags?.length ?? 0) +
    (filters.favoritesOnly ? 1 : 0);

  const toggleArray = (
    key: keyof ShowFilters,
    id: string,
    current: string[] | undefined
  ) => {
    const arr = current ?? [];
    const updated = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
    onFilterChange({ ...filters, [key]: updated });
  };

  return (
    <FilterPanel
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      activeCount={activeCount}
    >
      <ChipGroup
        label="Cidade"
        options={cityOptions}
        selectedIds={filters.city ?? []}
        onToggle={(id) => toggleArray('city', id, filters.city)}
      />
      {poles.length > 0 ? (
        <ChipGroup
          label="Polo / Palco"
          options={poles}
          selectedIds={filters.pole ?? []}
          onToggle={(id) => toggleArray('pole', id, filters.pole)}
        />
      ) : null}
      {origins.length > 0 ? (
        <ChipGroup
          label="Origem do Artista"
          options={origins}
          selectedIds={filters.artistOrigin ?? []}
          onToggle={(id) => toggleArray('artistOrigin', id, filters.artistOrigin)}
        />
      ) : null}
      {tagOptions.length > 0 ? (
        <ChipGroup
          label="Tipo / Tags"
          options={tagOptions}
          selectedIds={filters.tags ?? []}
          onToggle={(id) => toggleArray('tags', id, filters.tags)}
        />
      ) : null}
      <CheckboxField
        label="Só favoritos"
        checked={filters.favoritesOnly ?? false}
        onChange={(checked) => onFilterChange({ ...filters, favoritesOnly: checked })}
      />
      {activeCount > 0 ? (
        <Button variant="secondary" className="w-full" onClick={() => onFilterChange({})}>
          Limpar filtros
        </Button>
      ) : null}
    </FilterPanel>
  );
}
