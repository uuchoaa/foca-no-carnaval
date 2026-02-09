import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Clock, Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Bloco } from '../types/events';
import { Card, Badge, Text, Button } from '../design-system';

interface BlocoCardProps {
  bloco: Bloco;
  index?: number;
}

export default function BlocoCard({ bloco, index = 0 }: BlocoCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(bloco.id);

  const handleClick = () =>
    navigate(`/event/${bloco.id}`, { state: { from: location.pathname } });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(bloco.id);
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
            <Text variant="heading2" className="text-gray-900 block">
              {bloco.name}
            </Text>
            <div className="flex items-center gap-2 mt-1">
              <Badge color={bloco.city === 'recife' ? 'blue' : 'green'}>
                {bloco.city === 'recife' ? 'Recife' : 'Olinda'}
              </Badge>
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

        <div className="space-y-2 mt-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-carnival-orange" />
            <div>
              <Text variant="body" className="text-lg font-semibold text-carnival-orange">
                {bloco.concentration.time}
              </Text>
              <Text variant="small" className="text-gray-600 ml-2">
                Saída: {bloco.departure.time}
              </Text>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-gray-500 mt-0.5" />
            <Text variant="small" className="text-gray-700">
              {bloco.location.raw}
            </Text>
          </div>

          {bloco.artist ? (
            <div className="mt-2">
              <Badge color="purple">{bloco.artist}</Badge>
            </div>
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
}
