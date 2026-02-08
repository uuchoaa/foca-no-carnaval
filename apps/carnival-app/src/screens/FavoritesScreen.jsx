import { useState } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import BlocoCard from '../components/BlocoCard';
import ShowCard from '../components/ShowCard';
import { Heart } from 'lucide-react';
import clsx from 'clsx';

export default function FavoritesScreen() {
  const { getAllEvents } = useEvents();
  const { favorites } = useFavorites();
  const [filter, setFilter] = useState('all'); // 'all', 'blocos', 'shows'

  const allEvents = getAllEvents();
  const favoriteEvents = allEvents.filter(event => favorites.includes(event.id));

  const filteredFavorites = favoriteEvents.filter(event => {
    if (filter === 'blocos') return event.eventType === 'bloco';
    if (filter === 'shows') return event.eventType === 'show';
    return true;
  });

  const blocoCount = favoriteEvents.filter(e => e.eventType === 'bloco').length;
  const showCount = favoriteEvents.filter(e => e.eventType === 'show').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="fill-white" size={32} />
          Favoritos
        </h1>
        <p className="text-sm mt-1 opacity-90">
          {favorites.length} evento{favorites.length !== 1 ? 's' : ''} salvos
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <Heart size={80} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Nenhum favorito ainda
          </h2>
          <p className="text-gray-500 text-center">
            Comece adicionando eventos aos seus favoritos tocando no ícone de coração
          </p>
        </div>
      ) : (
        <>
          {/* Filter */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex gap-2 max-w-screen-xl mx-auto">
              <button
                onClick={() => setFilter('all')}
                className={clsx(
                  'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                  filter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Todos ({favorites.length})
              </button>
              <button
                onClick={() => setFilter('blocos')}
                className={clsx(
                  'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                  filter === 'blocos'
                    ? 'bg-carnival-orange text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Blocos ({blocoCount})
              </button>
              <button
                onClick={() => setFilter('shows')}
                className={clsx(
                  'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                  filter === 'shows'
                    ? 'bg-carnival-purple text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Shows ({showCount})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {filteredFavorites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Nenhum {filter === 'blocos' ? 'bloco' : filter === 'shows' ? 'show' : 'evento'} favorito
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFavorites.map(event => {
                  if (event.eventType === 'bloco') {
                    return <BlocoCard key={event.id} bloco={event} />;
                  }
                  return <ShowCard key={event.id} show={event} />;
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
