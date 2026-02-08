import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CheckboxField } from '../../../design-system';

const meta = {
  title: 'Design System/Compositions/CheckboxField',
  component: CheckboxField,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CheckboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: {
    label: 'Somente com artista',
    checked: false,
    onChange: () => {},
  },
};

export const Checked: Story = {
  args: {
    label: 'Só favoritos',
    checked: true,
    onChange: () => {},
  },
};

export const Interactive: Story = {
  render: function CheckboxFieldStory() {
    const [checked, setChecked] = useState(false);
    return (
      <div className="space-y-4">
        <CheckboxField
          label="Somente com artista"
          checked={checked}
          onChange={setChecked}
        />
        <CheckboxField
          label="Só favoritos"
          checked={!checked}
          onChange={() => setChecked(!checked)}
        />
      </div>
    );
  },
};
