import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagList } from '../../../design-system';

const meta = {
  title: 'Design System/Compositions/TagList',
  component: TagList,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof TagList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tags: [
      { label: 'Bloco', color: 'orange' },
      { label: 'Recife', color: 'blue' },
      { label: 'Olinda', color: 'green' },
    ],
  },
};

export const Single: Story = {
  args: { tags: [{ label: 'Show', color: 'purple' }] },
};

export const Many: Story = {
  args: {
    tags: [
      { label: 'Bloco', color: 'orange' },
      { label: 'Show', color: 'purple' },
      { label: 'Recife', color: 'blue' },
      { label: 'Olinda', color: 'green' },
      { label: 'Gratuito', color: 'gray' },
    ],
  },
};
