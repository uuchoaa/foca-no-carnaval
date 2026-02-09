import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardGrid, Card, Text } from '../../design-system';

const meta = {
  title: 'Design System/CardGrid',
  component: CardGrid,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof CardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <CardGrid>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <Card key={n} variant="default">
          <Text variant="heading2">Card {n}</Text>
          <Text variant="small" className="text-gray-500 block mt-1">
            Responsive grid: 1 col mobile, 2 md, 3 lg, 4 xl
          </Text>
        </Card>
      ))}
    </CardGrid>
  ),
};
