import { useState } from 'react';
import { useEvents } from '../contexts/EventsContext';
import BlocoCard from '../components/BlocoCard';
import ShowCard from '../components/ShowCard';
import type { Event, Bloco, Show } from '../types/events';
import { Page, TabGroup, CardGrid, Card, Text } from '../design-system';

type MapFilter = 'all' | 'blocos' | 'shows';

const mapTabOptions = [
  { id: 'all' as const, label: 'Todos', selectedStyle: 'all' as const },
  { id: 'blocos' as const, label: 'Blocos', selectedStyle: 'orange' as const },
  { id: 'shows' as const, label: 'Shows', selectedStyle: 'purple' as const },
];

export default function MapScreen() {
  const { getAllEvents } = useEvents();
  const [filter, setFilter] = useState<MapFilter>('all');

  const allEvents = getAllEvents();
  const filteredEvents = allEvents.filter((event) => {
    if (filter === 'blocos') return event.eventType === 'bloco';
    if (filter === 'shows') return event.eventType === 'show';
    return true;
  });

  return (
    <Page>
      <Page.Header
        gradient="map"
        title="Mapa"
        subtitle={`${filteredEvents.length} evento${filteredEvents.length !== 1 ? 's' : ''}`}
      />
      <TabGroup
        options={mapTabOptions}
        selectedId={filter}
        onSelect={(id) => setFilter(id as MapFilter)}
      />
      <div className="p-4">
        <div className="bg-gray-200 rounded-lg shadow-md h-96 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50" />
          <div className="relative z-10 text-center p-6">
            <div className="text-6xl mb-4">🗺️</div>
            <Text variant="heading2" className="text-gray-800 mb-2 block">
              Mapa em breve!
            </Text>
            <Text variant="body" className="text-gray-600 block">
              Visualização de eventos no mapa de Recife e Olinda
            </Text>
            <div className="mt-4 flex gap-2 justify-center">
              <div className="w-3 h-3 bg-carnival-orange rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-carnival-purple rounded-full animate-pulse delay-75" />
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-150" />
            </div>
          </div>
        </div>

        <Card variant="default" className="mt-4">
          <Text variant="body" className="font-medium text-gray-900 mb-3 block">
            Legenda
          </Text>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-carnival-orange rounded-full border-2 border-white shadow-md" />
              <Text variant="small" className="text-gray-700">
                Blocos
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-carnival-purple rounded-full border-2 border-white shadow-md" />
              <Text variant="small" className="text-gray-700">
                Shows
              </Text>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <Text variant="heading2" className="text-gray-900 mb-4 block">
            Eventos ({filteredEvents.length})
          </Text>
          <CardGrid>
            {filteredEvents.slice(0, 10).map((event: Event) => {
              if (event.eventType === 'bloco') {
                return <BlocoCard key={event.id} bloco={event as Bloco} />;
              }
              return <ShowCard key={event.id} show={event as Show} />;
            })}
          </CardGrid>
          {filteredEvents.length > 10 ? (
            <Text variant="small" className="text-center text-gray-500 mt-4 block">
              E mais {filteredEvents.length - 10} eventos...
            </Text>
          ) : null}
        </div>
      </div>
    </Page>
  );
}
