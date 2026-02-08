import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  MapPin,
  Clock,
  Mic2,
  Calendar,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { formatDate } from '../utils/dateHelpers';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Bloco, Show } from '../types/events';
import { Card, Badge, Button } from '../design-system';

export default function EventDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById } = useEvents();
  const { isFavorite, toggleFavorite } = useFavorites();

  const event = id ? getEventById(id) : undefined;

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Evento não encontrado</p>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mt-4">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const isBloco = event.eventType === 'bloco';
  const isFav = isFavorite(event.id);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50"
    >
      <div
        className={clsx(
          'text-white p-6 shadow-lg relative',
          isBloco
            ? 'bg-gradient-to-r from-carnival-orange to-carnival-yellow'
            : 'bg-gradient-to-r from-carnival-purple to-purple-600'
        )}
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={
            isFav ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}
          }
          transition={{ duration: 0.3 }}
          onClick={() => toggleFavorite(event.id)}
          className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <Heart size={24} className={clsx(isFav && 'fill-white')} />
        </motion.button>

        <div className="pt-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-white/20">
              {isBloco ? 'BLOCO' : 'SHOW'}
            </span>
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-white/20">
              {event.city === 'recife' ? 'Recife' : 'Olinda'}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2">{event.name}</h1>

          {!isBloco && 'artist' in event && event.artist ? (
            <div className="flex items-center gap-2 text-lg opacity-90">
              <Mic2 size={20} />
              <span>{event.artist}</span>
              <span className="text-sm bg-white/20 px-2 py-0.5 rounded">
                {'artistOrigin' in event ? event.artistOrigin : ''}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="p-6 space-y-6"
      >
        <Card variant="default">
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <Calendar size={20} />
            <span className="font-medium">Data e Horário</span>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 capitalize">
              {formatDate(event.date)}
            </p>
            {isBloco ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-carnival-orange" />
                  <span className="text-2xl font-bold text-carnival-orange">
                    {(event as Bloco).concentration.time}
                  </span>
                  <span className="text-sm text-gray-600">Concentração</span>
                </div>
                <div className="flex items-center gap-2 ml-7">
                  <span className="text-lg font-semibold text-gray-700">
                    {(event as Bloco).departure.time}
                  </span>
                  <span className="text-sm text-gray-600">Saída</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-carnival-purple" />
                <span className="text-2xl font-bold text-carnival-purple">
                  {(event as Show).showTime}
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card variant="default">
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPin size={20} />
            <span className="font-medium">Local</span>
          </div>
          {!isBloco && 'pole' in event && event.pole ? (
            <p className="text-lg font-semibold text-gray-900 mb-1">{event.pole}</p>
          ) : null}
          {event.location.venue ? (
            <p className="text-gray-700">{event.location.venue}</p>
          ) : null}
          {event.location.address ? (
            <p className="text-sm text-gray-600 mt-1">{event.location.address}</p>
          ) : null}
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/map')}
            className="mt-3 w-full !bg-blue-500 hover:!opacity-90"
          >
            Ver no mapa
          </Button>
        </Card>

        {isBloco && (event as Bloco).artist ? (
          <Card variant="default">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Mic2 size={20} />
              <span className="font-medium">Artista</span>
            </div>
            <p className="text-lg text-gray-900">{(event as Bloco).artist}</p>
          </Card>
        ) : null}

        {event.description ? (
          <Card variant="default">
            <h3 className="font-medium text-gray-900 mb-2">Sobre</h3>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </Card>
        ) : null}

        {event.tags && event.tags.length > 0 ? (
          <Card variant="default">
            <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, idx) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Badge color={isBloco ? 'orange' : 'purple'}>{tag}</Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        ) : null}

        {event.sources && event.sources.length > 0 ? (
          <Card variant="default">
            <h3 className="font-medium text-gray-900 mb-3">Fontes</h3>
            <div className="space-y-2">
              {event.sources.map((source, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-700">{source.id}</span>
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <ExternalLink size={16} />
                    </a>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </Card>
        ) : null}

        <Button
          variant="secondary"
          size="lg"
          className="w-full flex items-center justify-center gap-2"
        >
          <Share2 size={20} />
          Compartilhar evento
        </Button>
      </motion.div>
    </motion.div>
  );
}
