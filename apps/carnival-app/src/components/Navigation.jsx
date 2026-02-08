import { Link, useLocation } from 'react-router-dom';
import { Home, Mic2, Calendar, Map, Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import clsx from 'clsx';

export default function Navigation() {
  const location = useLocation();
  const { count } = useFavorites();

  const tabs = [
    { path: '/blocos', label: 'Blocos', icon: Home },
    { path: '/shows', label: 'Shows', icon: Mic2 },
    { path: '/calendar', label: 'Agenda', icon: Calendar },
    { path: '/map', label: 'Mapa', icon: Map },
    { path: '/favorites', label: 'Favoritos', icon: Heart, badge: count },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-safe">
        {tabs.map(({ path, label, icon: Icon, badge }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={clsx(
                'flex flex-col items-center justify-center flex-1 h-full relative transition-colors',
                isActive
                  ? 'text-carnival-orange'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <div className="relative">
                <Icon size={24} className={clsx(isActive && 'stroke-2')} />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span className={clsx('text-xs mt-1', isActive && 'font-semibold')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
