import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Field } from '../../../design-system';

const meta = {
  title: 'Design System/Compositions/Field',
  component: Field,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function FieldStory() {
    const [value, setValue] = useState('');
    return (
      <div className="w-64">
        <Field label="Buscar" value={value} onChange={setValue} placeholder="Digite..." />
      </div>
    );
  },
};

export const WithValue: Story = {
  render: function FieldStory() {
    const [value, setValue] = useState('Recife');
    return (
      <div className="w-64">
        <Field label="Cidade" value={value} onChange={setValue} placeholder="Cidade" />
      </div>
    );
  },
};
