import { useState } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { motion } from 'framer-motion';
import BlocoCard from '../components/BlocoCard';
import ShowCard from '../components/ShowCard';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import type { Event, Bloco, Show } from '../types/events';
import { Text } from '../design-system';

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-gray-50"
    >
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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-20 px-6"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <Heart size={80} className="text-gray-300 mb-4" />
          </motion.div>
          <Text variant="heading2" className="text-gray-700 mb-2">
            Nenhum favorito ainda
          </Text>
          <p className="text-gray-500 text-center">
            Comece adicionando eventos aos seus favoritos tocando no ícone de coração
          </p>
        </motion.div>
      ) : (
        <>
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex gap-2 max-w-screen-xl mx-auto">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter('all')}
                className={clsx(
                  'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                  filter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Todos ({favorites.length})
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter('blocos')}
                className={clsx(
                  'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                  filter === 'blocos'
                    ? 'bg-carnival-orange text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Blocos ({blocoCount})
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter('shows')}
                className={clsx(
                  'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                  filter === 'shows'
                    ? 'bg-carnival-purple text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Shows ({showCount})
              </motion.button>
            </div>
          </div>

          <div className="p-4">
            {filteredFavorites.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">
                  Nenhum{' '}
                  {filter === 'blocos' ? 'bloco' : filter === 'shows' ? 'show' : 'evento'}{' '}
                  favorito
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
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
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
