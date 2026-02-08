import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Input } from '../../design-system';

const meta = {
  title: 'Design System/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: '', placeholder: 'Digite aqui...', onChange: () => {} },
};

export const WithValue: Story = {
  args: { value: 'Texto digitado', placeholder: 'Placeholder', onChange: () => {} },
};

export const Interactive: Story = {
  render: function InteractiveInput() {
    const [value, setValue] = useState('');
    return (
      <div className="w-64">
        <Input value={value} onChange={setValue} placeholder="Buscar..." />
      </div>
    );
  },
};
