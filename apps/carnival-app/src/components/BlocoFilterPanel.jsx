import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function BlocoFilterPanel({ filters, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCityToggle = (city) => {
    const current = filters.city || [];
    const updated = current.includes(city)
      ? current.filter(c => c !== city)
      : [...current, city];
    onFilterChange({ ...filters, city: updated });
  };

  const handleArtistToggle = () => {
    onFilterChange({ ...filters, hasArtist: !filters.hasArtist });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const activeFilterCount = (
    (filters.city?.length || 0) +
    (filters.hasArtist ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-carnival-orange" />
          <span className="font-medium text-gray-900">Filtros</span>
          {activeFilterCount > 0 && (
            <span className="bg-carnival-orange text-white text-xs px-2 py-0.5 rounded-full font-medium">
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

          {/* Has Artist Filter */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasArtist || false}
                onChange={handleArtistToggle}
                className="w-4 h-4 text-carnival-orange focus:ring-carnival-orange rounded"
              />
              <span className="text-sm text-gray-700">Somente com artista</span>
            </label>
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
