import { useMemo } from 'react';
import { Clock, Heart, MapPin } from 'lucide-react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import type { Bloco } from '../types/events';
import { groupByDate, formatDate } from '../utils/dateHelpers';
import { Page, Text, Card, CardGrid, Badge, VStack, HStack, SectionHeading, Divider, IconLabel, FavButton } from '../design-system';

export default function BlocosHomeScreen() {
  const { getBlocos, loading } = useEvents();
  const { isFavorite, toggleFavorite } = useFavorites();
  const blocos = getBlocos({});
  const groupedByDate = useMemo(() => groupByDate(blocos), [blocos]);

  return (
    <Page>
      <Page.Header gradient="sunny">
        <Text variant="hero" color="inverse">Blocos</Text>
        <Text variant="subtitle" color="inverse">{blocos.length} blocos encontrados</Text>
      </Page.Header>
      <Page.Content isLoading={loading} isEmpty={blocos.length === 0}>
        <VStack gap={16} align="stretch">
          {groupedByDate.map(({ date, dayOfWeek, events }) => (
            <section key={date}>
              <VStack gap={4} align="stretch">
                <SectionHeading
                  title={formatDate(date)}
                  subtitle={dayOfWeek}
                />
                <CardGrid>
                {(events as Bloco[]).map((bloco) => (
                  <Card key={bloco.id} interactive>
                    <VStack gap={2} align="start">
                      <HStack justify="between" align="center" gap={2} className="w-full min-w-0">
                        <div className="min-w-0 flex-1">
                          <Text variant="title">{bloco.name}</Text>
                        </div>
                        <div className="self-center flex-shrink-0">
                          <FavButton
                            icon={Heart}
                            isActive={isFavorite(bloco.id)}
                            onToggle={() => toggleFavorite(bloco.id)}
                            iconSize={20}
                          />
                        </div>
                        
                      </HStack>
                      <Badge color="blue">{bloco.city}</Badge>
                      <IconLabel icon={Clock} iconColor="primary">
                        <Text variant="small">
                          {bloco.concentration.time} / {bloco.departure.time}
                        </Text>
                      </IconLabel>
                      <IconLabel icon={MapPin} iconColor="muted">
                        <Text variant="caption">{bloco.location.raw}</Text>
                      </IconLabel>
                    </VStack>
                  </Card>
                ))}
                </CardGrid>
                <Divider />
              </VStack>
            </section>
          ))}
        </VStack>
      </Page.Content>
    </Page>
  );
}
