import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeading } from '../../../design-system';

const meta = {
  title: 'Design System/Compositions/SectionHeading',
  component: SectionHeading,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: '8 de fevereiro', subtitle: 'sábado' },
};

export const TitleOnly: Story = {
  args: { title: 'Blocos do dia' },
};
