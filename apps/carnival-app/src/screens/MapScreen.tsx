import { useState } from 'react';
import { useEvents } from '../contexts/EventsContext';
import BlocoCard from '../components/BlocoCard';
import ShowCard from '../components/ShowCard';
import clsx from 'clsx';
import type { Event, Bloco, Show } from '../types/events';
import { Text, Card } from '../design-system';

type MapFilter = 'all' | 'blocos' | 'shows';

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 shadow-lg">
        <Text variant="heading1" className="!text-white">
          Mapa
        </Text>
        <p className="text-sm mt-1 opacity-90">
          {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex gap-2 max-w-screen-xl mx-auto">
          {(['all', 'blocos', 'shows'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={clsx(
                'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                filter === f
                  ? f === 'all'
                    ? 'bg-gray-900 text-white'
                    : f === 'blocos'
                      ? 'bg-carnival-orange text-white'
                      : 'bg-carnival-purple text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {f === 'all' ? 'Todos' : f === 'blocos' ? 'Blocos' : 'Shows'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="bg-gray-200 rounded-lg shadow-md h-96 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50" />
          <div className="relative z-10 text-center p-6">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Mapa em breve!</h2>
            <p className="text-gray-600">
              Visualização de eventos no mapa de Recife e Olinda
            </p>
            <div className="mt-4 flex gap-2 justify-center">
              <div className="w-3 h-3 bg-carnival-orange rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-carnival-purple rounded-full animate-pulse delay-75" />
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-150" />
            </div>
          </div>
        </div>

        <Card variant="default" className="mt-4">
          <h3 className="font-medium text-gray-900 mb-3">Legenda</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-carnival-orange rounded-full border-2 border-white shadow-md" />
              <span className="text-sm text-gray-700">Blocos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-carnival-purple rounded-full border-2 border-white shadow-md" />
              <span className="text-sm text-gray-700">Shows</span>
            </div>
          </div>
        </Card>

        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Eventos ({filteredEvents.length})
          </h2>
          <div className="space-y-3">
            {filteredEvents.slice(0, 10).map((event: Event) => {
              if (event.eventType === 'bloco') {
                return <BlocoCard key={event.id} bloco={event as Bloco} />;
              }
              return <ShowCard key={event.id} show={event as Show} />;
            })}
          </div>
          {filteredEvents.length > 10 ? (
            <p className="text-center text-gray-500 text-sm mt-4">
              E mais {filteredEvents.length - 10} eventos...
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
