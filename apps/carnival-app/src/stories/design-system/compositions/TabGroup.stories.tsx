import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TabGroup } from '../../../design-system';

const meta = {
  title: 'Design System/Compositions/TabGroup',
  component: TabGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TabGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { id: 'all', label: 'Todos', selectedStyle: 'all' as const },
  { id: 'blocos', label: 'Blocos', selectedStyle: 'orange' as const },
  { id: 'shows', label: 'Shows', selectedStyle: 'purple' as const },
];

export const Default: Story = {
  render: function TabGroupStory() {
    const [selectedId, setSelectedId] = useState('all');
    return (
      <div className="w-80">
        <TabGroup options={options} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    );
  },
};
