import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '../../design-system';

const meta = {
  title: 'Design System/Divider',
  component: Divider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Divider />
    </div>
  ),
};

export const BetweenSections: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">Seção 1</div>
      <Divider />
      <div className="bg-white p-4 rounded-lg shadow-sm">Seção 2</div>
    </div>
  ),
};
