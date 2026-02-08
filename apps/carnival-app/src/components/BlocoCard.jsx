import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import clsx from 'clsx';

export default function BlocoCard({ bloco }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(bloco.id);

  const handleClick = () => {
    navigate(`/event/${bloco.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(bloco.id);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">{bloco.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={clsx(
              "text-xs px-2 py-1 rounded-full font-medium",
              bloco.city === 'recife' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-green-100 text-green-700'
            )}>
              {bloco.city === 'recife' ? 'Recife' : 'Olinda'}
            </span>
          </div>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Heart
            size={20}
            className={clsx(
              isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'
            )}
          />
        </button>
      </div>

      <div className="space-y-2 mt-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-carnival-orange" />
          <div>
            <span className="text-lg font-semibold text-carnival-orange">
              {bloco.concentration.time}
            </span>
            <span className="text-sm text-gray-600 ml-2">
              Saída: {bloco.departure.time}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin size={16} className="text-gray-500 mt-0.5" />
          <span className="text-sm text-gray-700">{bloco.location.raw}</span>
        </div>

        {bloco.artist && (
          <div className="mt-2">
            <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
              {bloco.artist}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
