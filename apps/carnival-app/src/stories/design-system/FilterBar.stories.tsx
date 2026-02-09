import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterBar, SearchBarWithIcon, Button, Card } from '../../design-system';

const meta = {
  title: 'Design System/FilterBar',
  component: FilterBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function FilterBarStory() {
    return (
      <FilterBar>
        <SearchBarWithIcon value="" onChange={() => {}} placeholder="Buscar..." />
        <Card variant="muted" className="p-4">
          <span className="text-sm">Date filter placeholder</span>
        </Card>
        <Card variant="muted" className="p-4">
          <Button variant="secondary">Filtros</Button>
        </Card>
      </FilterBar>
    );
  },
};
