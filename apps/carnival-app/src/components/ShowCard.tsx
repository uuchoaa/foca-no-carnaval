import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Clock, Heart, Mic2 } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Show } from '../types/events';
import { Card, Badge, Text, Button } from '../design-system';

interface ShowCardProps {
  show: Show;
  index?: number;
}

export default function ShowCard({ show, index = 0 }: ShowCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(show.id);

  const handleClick = () =>
    navigate(`/event/${show.id}`, { state: { from: location.pathname } });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(show.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={handleClick}
    >
      <Card
        variant="default"
        className="cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-h-[2.75em]">
            <div className="flex items-center gap-2 mb-1">
              <Mic2 size={18} className="text-carnival-purple" />
              <Text variant="heading2" className="text-gray-900">
                {show.artist}
              </Text>
            </div>
            <Text variant="small" className="text-gray-600 block">
              {show.name}
            </Text>
            <div className="flex items-center gap-2 mt-2">
              <Badge color={show.city === 'recife' ? 'blue' : 'green'}>
                {show.city === 'recife' ? 'Recife' : 'Olinda'}
              </Badge>
              <Badge color="gray">{show.artistOrigin}</Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className="p-2 min-w-0"
          >
            <Heart
              size={20}
              className={clsx(isFav ? 'fill-red-500 text-red-500' : 'text-gray-400')}
            />
          </Button>
        </div>

        <div className="space-y-2 mt-3 border-t pt-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-carnival-purple" />
            <Text variant="body" className="text-lg font-semibold text-carnival-purple">
              {show.showTime}
            </Text>
          </div>

          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-gray-500 mt-0.5" />
            <div>
              <Text variant="small" className="font-medium text-gray-900 block">
                {show.pole}
              </Text>
              {show.location.venue ? (
                <Text variant="caption" className="text-gray-600 block">
                  {show.location.venue}
                </Text>
              ) : null}
            </div>
          </div>

          {show.tags && show.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-2">
              {show.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} color="purple">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
}
