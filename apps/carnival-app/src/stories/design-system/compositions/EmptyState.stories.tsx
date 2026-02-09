import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heart } from 'lucide-react';
import { EmptyState } from '../../../design-system';

const meta = {
  title: 'Design System/Compositions/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Nenhum resultado',
    description: 'Tente ajustar os filtros ou busca',
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="py-12">
      <EmptyState
        icon={<Heart size={64} className="text-gray-300 mx-auto" />}
        title="Nenhum favorito ainda"
        description="Comece adicionando eventos aos seus favoritos"
      />
    </div>
  ),
};
