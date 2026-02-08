import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../../design-system';

const meta = {
  title: 'Design System/Text',
  component: Text,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['heading1', 'heading2', 'body', 'small', 'caption'],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
  args: { variant: 'heading1', children: 'Título principal' },
};

export const Heading2: Story = {
  args: { variant: 'heading2', children: 'Subtítulo' },
};

export const Body: Story = {
  args: { variant: 'body', children: 'Texto de corpo.' },
};

export const Small: Story = {
  args: { variant: 'small', children: 'Texto pequeno' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Text variant="heading1">Heading 1</Text>
      <Text variant="heading2">Heading 2</Text>
      <Text variant="body">Body text</Text>
      <Text variant="small">Small text</Text>
      <Text variant="caption">Caption</Text>
    </div>
  ),
};
