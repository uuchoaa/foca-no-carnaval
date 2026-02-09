import { useEvents } from '../contexts/EventsContext';
import { Page, Text, Card, CardGrid } from '../design-system';

export default function BlocosHomeScreen() {
  const { getBlocos, loading } = useEvents();
  const blocos = getBlocos({});

  return (
    <Page>
      <Page.Header gradient="sunny">
        <Text variant="hero" color="inverse">Blocos</Text>
        <Text variant="subtitle" color="inverse">{blocos.length} blocos encontrados</Text>
      </Page.Header>
      <Page.Content isLoading={loading} isEmpty={blocos.length === 0}>
        <CardGrid>
          {blocos.map((bloco) => (
            <Card key={bloco.id}>
              <Text variant="title">{bloco.name}</Text>
            </Card>
          ))}
        </CardGrid>
      </Page.Content>
    </Page>
  );
}
