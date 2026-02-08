import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  FilterPanel,
  ChipGroup,
  CheckboxField,
  Button,
} from '../../../design-system';

const meta = {
  title: 'Design System/Compositions/FilterPanel',
  component: FilterPanel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const cityOptions = [
  { id: 'recife', label: 'Recife', color: 'blue' as const },
  { id: 'olinda', label: 'Olinda', color: 'green' as const },
];

const tagOptions = [
  { id: 'frevo', label: 'Frevo' },
  { id: 'tradicional', label: 'Tradicional' },
  { id: 'maracatu', label: 'Maracatu' },
];

export const Default: Story = {
  render: function FilterPanelStory() {
    const [isOpen, setIsOpen] = useState(true);
    const [city, setCity] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [hasArtist, setHasArtist] = useState(false);
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const toggleCity = (id: string) =>
      setCity((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    const toggleTag = (id: string) =>
      setTags((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    const activeCount = city.length + tags.length + (hasArtist ? 1 : 0) + (favoritesOnly ? 1 : 0);

    return (
      <div className="w-full max-w-sm">
        <FilterPanel isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} activeCount={activeCount}>
          <ChipGroup label="Cidade" options={cityOptions} selectedIds={city} onToggle={toggleCity} />
          <ChipGroup label="Tipo / Tags" options={tagOptions} selectedIds={tags} onToggle={toggleTag} />
          <CheckboxField
            label="Somente com artista"
            checked={hasArtist}
            onChange={setHasArtist}
          />
          <CheckboxField label="Só favoritos" checked={favoritesOnly} onChange={setFavoritesOnly} />
          {activeCount > 0 && (
            <Button variant="secondary" className="w-full">
              Limpar filtros
            </Button>
          )}
        </FilterPanel>
      </div>
    );
  },
};

export const Collapsed: Story = {
  render: function FilterPanelStory() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="w-full max-w-sm">
        <FilterPanel isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} activeCount={2}>
          <p className="text-sm text-gray-600">Conteúdo dos filtros aqui.</p>
        </FilterPanel>
      </div>
    );
  },
};
