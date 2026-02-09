import { useState } from 'react';
import { useEvents } from '../contexts/EventsContext';
import type { BlocoFilters } from '../types/events';
import {
  FilterPanel,
  ChipGroup,
  CheckboxField,
  Button,
  type ChipOption,
} from '../design-system';

interface BlocoFilterPanelProps {
  filters: BlocoFilters;
  onFilterChange: (filters: BlocoFilters) => void;
}

const cityOptions: ChipOption[] = [
  { id: 'recife', label: 'Recife', color: 'blue' },
  { id: 'olinda', label: 'Olinda', color: 'green' },
];

export default function BlocoFilterPanel({ filters, onFilterChange }: BlocoFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { getBlocoTags } = useEvents();
  const tagOptions: ChipOption[] = getBlocoTags().map((tag) => ({
    id: tag,
    label: tag,
    color: 'orange',
  }));

  const activeCount =
    (filters.city?.length ?? 0) +
    (filters.tags?.length ?? 0) +
    (filters.hasArtist ? 1 : 0) +
    (filters.favoritesOnly ? 1 : 0);

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
        onToggle={(id) => {
          const current = filters.city ?? [];
          const updated = current.includes(id)
            ? current.filter((c) => c !== id)
            : [...current, id];
          onFilterChange({ ...filters, city: updated });
        }}
      />
      {tagOptions.length > 0 ? (
        <ChipGroup
          label="Tipo / Tags"
          options={tagOptions}
          selectedIds={filters.tags ?? []}
          onToggle={(id) => {
            const current = filters.tags ?? [];
            const updated = current.includes(id)
              ? current.filter((t) => t !== id)
              : [...current, id];
            onFilterChange({ ...filters, tags: updated });
          }}
        />
      ) : null}
      <CheckboxField
        label="Somente com artista"
        checked={filters.hasArtist ?? false}
        onChange={(checked) => onFilterChange({ ...filters, hasArtist: checked })}
      />
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
