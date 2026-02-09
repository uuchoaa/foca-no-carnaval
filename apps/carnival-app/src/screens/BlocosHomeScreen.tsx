import { useMemo } from 'react';
import { useEvents } from '../contexts/EventsContext';
import type { Bloco } from '../types/events';
import { groupByDate, formatDate } from '../utils/dateHelpers';
import { Page, Text, Card, CardGrid, Badge, VStack, SectionHeading } from '../design-system';

export default function BlocosHomeScreen() {
  const { getBlocos, loading } = useEvents();
  const blocos = getBlocos({});
  const groupedByDate = useMemo(() => groupByDate(blocos), [blocos]);

  return (
    <Page>
      <Page.Header gradient="sunny">
        <Text variant="hero" color="inverse">Blocos</Text>
        <Text variant="subtitle" color="inverse">{blocos.length} blocos encontrados</Text>
      </Page.Header>
      <Page.Content isLoading={loading} isEmpty={blocos.length === 0}>
        <VStack gap={6} align="stretch">
          {groupedByDate.map(({ date, dayOfWeek, events }) => (
            <section key={date}>
              <VStack gap={3} align="stretch">
                <SectionHeading
                  title={formatDate(date)}
                  subtitle={dayOfWeek}
                />
                <CardGrid>
                {(events as Bloco[]).map((bloco) => (
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
              </VStack>
            </section>
          ))}
        </VStack>
      </Page.Content>
    </Page>
  );
}
