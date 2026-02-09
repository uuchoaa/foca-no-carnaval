import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingSpinner } from '../../../design-system';

const meta = {
  title: 'Design System/Compositions/LoadingSpinner',
  component: LoadingSpinner,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Orange: Story = {
  args: { variant: 'orange' },
};

export const Purple: Story = {
  args: { variant: 'purple', message: 'Carregando shows...' },
};
