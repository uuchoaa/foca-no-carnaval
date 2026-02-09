import { useState } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import BlocoCard from '../components/BlocoCard';
import ShowCard from '../components/ShowCard';
import { Heart } from 'lucide-react';
import type { Event, Bloco, Show } from '../types/events';
import { Page, TabGroup, CardGrid, Text } from '../design-system';

type FavoritesFilter = 'all' | 'blocos' | 'shows';

export default function FavoritesScreen() {
  const { getAllEvents } = useEvents();
  const { favorites } = useFavorites();
  const [filter, setFilter] = useState<FavoritesFilter>('all');

  const allEvents = getAllEvents();
  const favoriteEvents = allEvents.filter((e) => favorites.includes(e.id));
  const filteredFavorites = favoriteEvents.filter((e) => {
    if (filter === 'blocos') return e.eventType === 'bloco';
    if (filter === 'shows') return e.eventType === 'show';
    return true;
  });

  const blocoCount = favoriteEvents.filter((e) => e.eventType === 'bloco').length;
  const showCount = favoriteEvents.filter((e) => e.eventType === 'show').length;

  const tabOptions = [
    { id: 'all' as const, label: `Todos (${favorites.length})`, selectedStyle: 'all' as const },
    { id: 'blocos' as const, label: `Blocos (${blocoCount})`, selectedStyle: 'orange' as const },
    { id: 'shows' as const, label: `Shows (${showCount})`, selectedStyle: 'purple' as const },
  ];

  return (
    <Page>
      <Page.Header
        gradient="favorites"
        title={
          <span className="flex items-center gap-2">
            <Heart className="fill-white" size={32} />
            <Text variant="heading1" className="!text-white">
              Favoritos
            </Text>
          </span>
        }
        subtitle={`${favorites.length} evento${favorites.length !== 1 ? 's' : ''} salvos`}
      />
      {favorites.length === 0 ? (
        <Page.EmptyState
          icon={<Heart size={80} className="text-gray-300 mb-4" />}
          title="Nenhum favorito ainda"
          description="Comece adicionando eventos aos seus favoritos tocando no ícone de coração"
        />
      ) : (
        <>
          <TabGroup
            options={tabOptions}
            selectedId={filter}
            onSelect={(id) => setFilter(id as FavoritesFilter)}
          />
          <Page.Content>
            {filteredFavorites.length === 0 ? (
              <Page.EmptyState
                title={`Nenhum ${filter === 'blocos' ? 'bloco' : filter === 'shows' ? 'show' : 'evento'} favorito`}
              />
            ) : (
              <CardGrid>
                {filteredFavorites.map((event: Event, idx: number) => {
                  if (event.eventType === 'bloco') {
                    return (
                      <BlocoCard key={event.id} bloco={event as Bloco} index={idx} />
                    );
                  }
                  return (
                    <ShowCard key={event.id} show={event as Show} index={idx} />
                  );
                })}
              </CardGrid>
            )}
          </Page.Content>
        </>
      )}
    </Page>
  );
}
