import { Link, useLocation } from 'react-router-dom';
import { Home, Mic2, Calendar, Map, Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { motion } from 'framer-motion';
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
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-safe relative">
        {tabs.map(({ path, label, icon: Icon, badge }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={clsx(
                'flex flex-col items-center justify-center flex-1 h-full relative transition-colors'
              )}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={isActive ? { 
                  y: [0, -4, 0]
                } : {}}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <Icon 
                  size={24} 
                  className={clsx(
                    isActive ? 'text-carnival-orange stroke-2' : 'text-gray-500'
                  )}
                />
                {badge > 0 && (
                  <motion.span
                    key={badge}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [0, 1.3, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 500 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold"
                  >
                    {badge > 9 ? '9+' : badge}
                  </motion.span>
                )}
              </motion.div>
              
              <span className={clsx(
                'text-xs mt-1',
                isActive ? 'text-carnival-orange font-semibold' : 'text-gray-500'
              )}>
                {label}
              </span>
              
              {/* Indicador deslizante */}
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-carnival-orange rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
