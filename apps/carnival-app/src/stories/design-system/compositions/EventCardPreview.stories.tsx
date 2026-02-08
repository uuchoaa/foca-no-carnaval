import type { Meta, StoryObj } from '@storybook/react-vite';
import { EventCardPreview } from '../../../design-system';

const meta = {
  title: 'Design System/Compositions/EventCardPreview',
  component: EventCardPreview,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'highlight', 'muted'],
    },
  },
} satisfies Meta<typeof EventCardPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Galo da Madrugada',
    tags: [
      { label: 'Bloco', color: 'orange' },
      { label: 'Recife', color: 'blue' },
    ],
    meta: 'Sábado, 8h · Centro',
  },
};

export const Highlight: Story = {
  args: {
    ...Default.args,
    variant: 'highlight',
  },
};

export const Show: Story = {
  args: {
    title: 'Festival Recbeat',
    tags: [
      { label: 'Show', color: 'purple' },
      { label: 'Olinda', color: 'green' },
    ],
    meta: 'Domingo, 18h · Marco Zero',
  },
};
