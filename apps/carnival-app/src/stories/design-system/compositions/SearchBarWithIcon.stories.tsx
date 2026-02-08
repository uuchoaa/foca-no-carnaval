import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SearchBarWithIcon } from '../../../design-system';

const meta = {
  title: 'Design System/Compositions/SearchBarWithIcon',
  component: SearchBarWithIcon,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchBarWithIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function SearchBarStory() {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <SearchBarWithIcon value={value} onChange={setValue} placeholder="Buscar blocos..." />
      </div>
    );
  },
};

export const WithValue: Story = {
  render: function SearchBarStory() {
    const [value, setValue] = useState('Galo');
    return (
      <div className="w-80">
        <SearchBarWithIcon value={value} onChange={setValue} placeholder="Buscar blocos..." />
      </div>
    );
  },
};
