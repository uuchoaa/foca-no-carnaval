import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ChipGroup } from '../../../design-system';

const meta = {
  title: 'Design System/Compositions/ChipGroup',
  component: ChipGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ChipGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const cityOptions = [
  { id: 'recife', label: 'Recife', color: 'blue' as const },
  { id: 'olinda', label: 'Olinda', color: 'green' as const },
];

const tagOptions = [
  { id: 'afoxe', label: 'Afoxe' },
  { id: 'bonecos', label: 'Bonecos' },
  { id: 'feminista', label: 'Feminista' },
  { id: 'frevo', label: 'Frevo' },
  { id: 'gigante', label: 'Gigante' },
  { id: 'infantil', label: 'Infantil' },
  { id: 'lgbt', label: 'Lgbt' },
  { id: 'matinal', label: 'Matinal' },
  { id: 'noturno', label: 'Noturno' },
  { id: 'orquestra', label: 'Orquestra' },
  { id: 'previas', label: 'Previas' },
  { id: 'tradicional', label: 'Tradicional' },
];

export const City: Story = {
  render: function ChipGroupStory() {
    const [selected, setSelected] = useState<string[]>([]);
    const toggle = (id: string) =>
      setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    return (
      <div className="w-80">
        <ChipGroup
          label="Cidade"
          options={cityOptions}
          selectedIds={selected}
          onToggle={toggle}
        />
      </div>
    );
  },
};

export const TipoTags: Story = {
  render: function ChipGroupStory() {
    const [selected, setSelected] = useState<string[]>(['tradicional']);
    const toggle = (id: string) =>
      setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    return (
      <div className="w-80">
        <ChipGroup
          label="Tipo / Tags"
          options={tagOptions}
          selectedIds={selected}
          onToggle={toggle}
        />
      </div>
    );
  },
};
