import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../design-system';

const meta = {
  title: 'Design System/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['orange', 'purple', 'blue', 'green', 'gray'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Orange: Story = {
  args: { color: 'orange', children: 'Bloco' },
};

export const Purple: Story = {
  args: { color: 'purple', children: 'Show' },
};

export const City: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge color="blue">Recife</Badge>
      <Badge color="green">Olinda</Badge>
    </div>
  ),
};
