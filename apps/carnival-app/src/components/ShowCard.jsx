import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Heart, Mic2 } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function ShowCard({ show, index = 0 }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(show.id);

  const handleClick = () => {
    navigate(`/event/${show.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(show.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Mic2 size={18} className="text-carnival-purple" />
            <h3 className="font-bold text-lg text-gray-900">{show.artist}</h3>
          </div>
          <p className="text-sm text-gray-600">{show.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={clsx(
              "text-xs px-2 py-1 rounded-full font-medium",
              show.city === 'recife' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-green-100 text-green-700'
            )}>
              {show.city === 'recife' ? 'Recife' : 'Olinda'}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {show.artistOrigin}
            </span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
          animate={isFav ? { 
            scale: [1, 1.3, 1],
            rotate: [0, -10, 10, 0]
          } : {}}
          transition={{ duration: 0.3 }}
          onClick={handleFavoriteClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Heart
            size={20}
            className={clsx(
              isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'
            )}
          />
        </motion.button>
      </div>

      <div className="space-y-2 mt-3 border-t pt-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-carnival-purple" />
          <span className="text-lg font-semibold text-carnival-purple">
            {show.showTime}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <MapPin size={16} className="text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">{show.pole}</p>
            {show.location.venue && (
              <p className="text-xs text-gray-600">{show.location.venue}</p>
            )}
          </div>
        </div>

        {show.tags && show.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {show.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-600">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
