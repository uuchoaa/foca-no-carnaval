import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { BlocoFilters } from '../types/events';
import { Card } from '../design-system';

interface BlocoFilterPanelProps {
  filters: BlocoFilters;
  onFilterChange: (filters: BlocoFilters) => void;
}

export default function BlocoFilterPanel({ filters, onFilterChange }: BlocoFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { getBlocoTags } = useEvents();
  const availableTags = getBlocoTags();

  const handleCityToggle = (city: 'recife' | 'olinda') => {
    const current = filters.city ?? [];
    const updated = current.includes(city)
      ? current.filter((c) => c !== city)
      : [...current, city];
    onFilterChange({ ...filters, city: updated });
  };

  const handleTagToggle = (tag: string) => {
    const current = filters.tags ?? [];
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    onFilterChange({ ...filters, tags: updated });
  };

  const handleArtistToggle = () => {
    onFilterChange({ ...filters, hasArtist: !filters.hasArtist });
  };

  const handleFavoritesOnlyToggle = () => {
    onFilterChange({ ...filters, favoritesOnly: !filters.favoritesOnly });
  };

  const clearFilters = () => onFilterChange({});

  const activeFilterCount =
    (filters.city?.length ?? 0) +
    (filters.tags?.length ?? 0) +
    (filters.hasArtist ? 1 : 0) +
    (filters.favoritesOnly ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0);

  return (
    <Card variant="muted" className="!p-0 !shadow-sm border border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-carnival-orange" />
          <span className="font-medium text-gray-900">Filtros</span>
          {activeFilterCount > 0 ? (
            <motion.span
              key={activeFilterCount}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-carnival-orange text-white text-xs px-2 py-0.5 rounded-full font-medium"
            >
              {activeFilterCount}
            </motion.span>
          ) : null}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500"
        >
          ▼
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-200 space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCityToggle('recife')}
                    className={clsx(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                      (filters.city ?? []).includes('recife')
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    Recife
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCityToggle('olinda')}
                    className={clsx(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                      (filters.city ?? []).includes('olinda')
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    Olinda
                  </button>
                </div>
              </div>

              {availableTags.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo / Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <motion.button
                        key={tag}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTagToggle(tag)}
                        className={clsx(
                          'px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize',
                          (filters.tags ?? []).includes(tag)
                            ? 'bg-carnival-orange text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasArtist ?? false}
                    onChange={handleArtistToggle}
                    className="w-4 h-4 text-carnival-orange focus:ring-carnival-orange rounded"
                  />
                  <span className="text-sm text-gray-700">Somente com artista</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.favoritesOnly ?? false}
                    onChange={handleFavoritesOnlyToggle}
                    className="w-4 h-4 text-carnival-orange focus:ring-carnival-orange rounded"
                  />
                  <span className="text-sm text-gray-700">Só favoritos</span>
                </label>
              </div>

              {activeFilterCount > 0 ? (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <X size={16} />
                  Limpar filtros
                </motion.button>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}
