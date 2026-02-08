import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import { useEvents } from '../contexts/EventsContext';
import clsx from 'clsx';

export default function ShowFilterPanel({ filters, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const { getPoles, getArtistOrigins } = useEvents();

  const poles = getPoles();
  const artistOrigins = getArtistOrigins();

  const handleCityToggle = (city) => {
    const current = filters.city || [];
    const updated = current.includes(city)
      ? current.filter(c => c !== city)
      : [...current, city];
    onFilterChange({ ...filters, city: updated });
  };

  const handlePoleToggle = (pole) => {
    const current = filters.pole || [];
    const updated = current.includes(pole)
      ? current.filter(p => p !== pole)
      : [...current, pole];
    onFilterChange({ ...filters, pole: updated });
  };

  const handleOriginToggle = (origin) => {
    const current = filters.artistOrigin || [];
    const updated = current.includes(origin)
      ? current.filter(o => o !== origin)
      : [...current, origin];
    onFilterChange({ ...filters, artistOrigin: updated });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const activeFilterCount = (
    (filters.city?.length || 0) +
    (filters.pole?.length || 0) +
    (filters.artistOrigin?.length || 0)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-carnival-purple" />
          <span className="font-medium text-gray-900">Filtros</span>
          {activeFilterCount > 0 && (
            <span className="bg-carnival-purple text-white text-xs px-2 py-0.5 rounded-full font-medium">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="text-gray-500">
          {isOpen ? '▲' : '▼'}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-200 space-y-4">
          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cidade
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleCityToggle('recife')}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  (filters.city || []).includes('recife')
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Recife
              </button>
              <button
                onClick={() => handleCityToggle('olinda')}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                  (filters.city || []).includes('olinda')
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Olinda
              </button>
            </div>
          </div>

          {/* Pole Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Polo / Palco
            </label>
            <div className="flex flex-wrap gap-2">
              {poles.map(pole => (
                <button
                  key={pole}
                  onClick={() => handlePoleToggle(pole)}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                    (filters.pole || []).includes(pole)
                      ? 'bg-carnival-purple text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {pole}
                </button>
              ))}
            </div>
          </div>

          {/* Artist Origin Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Origem do Artista
            </label>
            <div className="flex flex-wrap gap-2">
              {artistOrigins.map(origin => (
                <button
                  key={origin}
                  onClick={() => handleOriginToggle(origin)}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                    (filters.artistOrigin || []).includes(origin)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {origin}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <X size={16} />
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
