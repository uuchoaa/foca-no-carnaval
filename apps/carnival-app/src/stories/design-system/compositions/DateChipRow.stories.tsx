import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DateChipRow } from '../../../design-system';

const meta = {
  title: 'Design System/Compositions/DateChipRow',
  component: DateChipRow,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof DateChipRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleDates: { id: string | null; label: string; sublabel?: string }[] = [
  { id: null, label: 'Todos' },
  { id: '1', label: '7', sublabel: 'SÁB' },
  { id: '2', label: '12', sublabel: 'QUI' },
  { id: '3', label: '13', sublabel: 'SEX' },
  { id: '4', label: '14', sublabel: 'SÁB' },
  { id: '5', label: '15', sublabel: 'DOM' },
];

export const Default: Story = {
  render: function DateChipRowStory() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    return (
      <div className="w-full max-w-md">
        <DateChipRow
          label="Data"
          items={sampleDates}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    );
  },
};

export const WithSelection: Story = {
  render: function DateChipRowStory() {
    const [selectedId, setSelectedId] = useState<string | null>('3');
    return (
      <div className="w-full max-w-md">
        <DateChipRow
          label="Data"
          items={sampleDates}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    );
  },
};
