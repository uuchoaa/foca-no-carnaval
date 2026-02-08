import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../../design-system';

const meta = {
  title: 'Design System/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'highlight', 'muted'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default', children: 'Conteúdo do card' },
};

export const Highlight: Story = {
  args: { variant: 'highlight', children: 'Card em destaque' },
};

export const Muted: Story = {
  args: { variant: 'muted', children: 'Card discreto' },
};
