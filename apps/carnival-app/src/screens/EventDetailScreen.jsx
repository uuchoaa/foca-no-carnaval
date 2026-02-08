import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Clock, Mic2, Calendar, ExternalLink, Share2 } from 'lucide-react';
import { useEvents } from '../contexts/EventsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { formatDate, formatTime } from '../utils/dateHelpers';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function EventDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEventById } = useEvents();
  const { isFavorite, toggleFavorite } = useFavorites();

  const event = getEventById(id);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Evento não encontrado</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-carnival-orange hover:underline"
          >
            Voltar
          </button>
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
      {/* Header */}
      <div className={clsx(
        "text-white p-6 shadow-lg relative",
        isBloco
          ? "bg-gradient-to-r from-carnival-orange to-carnival-yellow"
          : "bg-gradient-to-r from-carnival-purple to-purple-600"
      )}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isFav ? { 
            scale: [1, 1.3, 1],
            rotate: [0, -10, 10, 0]
          } : {}}
          transition={{ duration: 0.3 }}
          onClick={() => toggleFavorite(event.id)}
          className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <Heart
            size={24}
            className={clsx(isFav && 'fill-white')}
          />
        </motion.button>

        <div className="pt-12">
          <div className="flex items-center gap-2 mb-2">
            <span className={clsx(
              "text-xs px-2 py-1 rounded-full font-medium bg-white/20"
            )}>
              {isBloco ? 'BLOCO' : 'SHOW'}
            </span>
            <span className={clsx(
              "text-xs px-2 py-1 rounded-full font-medium bg-white/20"
            )}>
              {event.city === 'recife' ? 'Recife' : 'Olinda'}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2">{event.name}</h1>

          {!isBloco && event.artist && (
            <div className="flex items-center gap-2 text-lg opacity-90">
              <Mic2 size={20} />
              <span>{event.artist}</span>
              <span className="text-sm bg-white/20 px-2 py-0.5 rounded">
                {event.artistOrigin}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="p-6 space-y-6"
      >
        {/* Date and Time */}
        <div className="bg-white rounded-lg shadow-md p-4">
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
                    {event.concentration.time}
                  </span>
                  <span className="text-sm text-gray-600">Concentração</span>
                </div>
                <div className="flex items-center gap-2 ml-7">
                  <span className="text-lg font-semibold text-gray-700">
                    {event.departure.time}
                  </span>
                  <span className="text-sm text-gray-600">Saída</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-carnival-purple" />
                <span className="text-2xl font-bold text-carnival-purple">
                  {event.showTime}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPin size={20} />
            <span className="font-medium">Local</span>
          </div>
          
          {!isBloco && event.pole && (
            <p className="text-lg font-semibold text-gray-900 mb-1">
              {event.pole}
            </p>
          )}
          
          {event.location.venue && (
            <p className="text-gray-700">{event.location.venue}</p>
          )}
          
          {event.location.address && (
            <p className="text-sm text-gray-600 mt-1">{event.location.address}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/map')}
            className="mt-3 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Ver no mapa
          </motion.button>
        </div>

        {/* Artist (for blocos) */}
        {isBloco && event.artist && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Mic2 size={20} />
              <span className="font-medium">Artista</span>
            </div>
            <p className="text-lg text-gray-900">{event.artist}</p>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium text-gray-900 mb-2">Sobre</h3>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, idx) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={clsx(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    isBloco
                      ? "bg-orange-100 text-orange-700"
                      : "bg-purple-100 text-purple-700"
                  )}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* Sources */}
        {event.sources && event.sources.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4">
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
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Share Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Share2 size={20} />
          Compartilhar evento
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
