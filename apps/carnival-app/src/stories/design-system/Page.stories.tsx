import type { Meta, StoryObj } from '@storybook/react-vite';
import { Page, Text } from '../../design-system';

const meta = {
  title: 'Design System/Page',
  component: Page,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Blocos: Story = {
  render: () => (
    <Page>
      <Page.Header
        gradient="blocos"
        title="Blocos"
        subtitle="42 blocos encontrados"
      />
      <Page.Content>
        <Text variant="body">Conteúdo da página aqui.</Text>
      </Page.Content>
    </Page>
  ),
};

export const WithTabs: Story = {
  render: () => (
    <Page>
      <Page.Header gradient="shows" title="Shows" subtitle="15 shows" />
      <div className="p-4 bg-white border-b border-gray-200">
        <Text variant="small" className="text-gray-500">
          (TabGroup would go here)
        </Text>
      </div>
      <Page.Content>
        <Text variant="body">Lista de shows.</Text>
      </Page.Content>
    </Page>
  ),
};
