import { useEvents } from '../contexts/EventsContext';
import { Page, Text, Card, CardGrid, Badge, VStack } from '../design-system';

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
              <VStack gap={2} align="start">
                <Text variant="title">{bloco.name}</Text>
                <Badge color="blue">{bloco.city}</Badge>
                <Text variant="small">
                  {bloco.concentration.time} / {bloco.departure.time}
                </Text>
                <Text variant="caption">{bloco.location.raw}</Text>
              </VStack>
            </Card>
          ))}
        </CardGrid>
      </Page.Content>
    </Page>
  );
}
