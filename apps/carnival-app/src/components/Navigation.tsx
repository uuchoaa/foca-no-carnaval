import { Link, useLocation } from 'react-router-dom';
import { Home, Mic2, Map, Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface TabConfig {
  path: string;
  label: string;
  icon: typeof Home;
  activeClass: string;
  activeBg: string;
  badge?: number;
}

export default function Navigation() {
  const location = useLocation();
  const { count } = useFavorites();

  const tabs: TabConfig[] = [
    {
      path: '/blocos',
      label: 'Blocos',
      icon: Home,
      activeClass: 'text-carnival-orange',
      activeBg: 'bg-carnival-orange',
    },
    {
      path: '/shows',
      label: 'Shows',
      icon: Mic2,
      activeClass: 'text-carnival-purple',
      activeBg: 'bg-carnival-purple',
    },
    {
      path: '/map',
      label: 'Mapa',
      icon: Map,
      activeClass: 'text-blue-500',
      activeBg: 'bg-blue-500',
    },
    {
      path: '/favorites',
      label: 'Favoritos',
      icon: Heart,
      badge: count,
      activeClass: 'text-red-500',
      activeBg: 'bg-red-500',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_2px_rgba(0,0,0,0.08)] z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-safe relative">
        {tabs.map(({ path, label, icon: Icon, badge, activeClass, activeBg }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center justify-center flex-1 min-w-0 h-full relative transition-colors"
            >
              {isActive ? (
                <motion.div
                  layoutId="navbar-indicator"
                  className={clsx(
                    'absolute -top-1 left-0 right-0 w-8 h-1 rounded-full mx-auto',
                    activeBg
                  )}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              ) : null}

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={isActive ? { y: [0, -4, 0] } : {}}
                transition={{ duration: 0.3 }}
                className="relative flex flex-col items-center"
              >
                <Icon
                  size={24}
                  className={clsx(
                    isActive && activeClass,
                    isActive && 'stroke-2',
                    !isActive && 'text-gray-500'
                  )}
                />
                {badge != null && badge > 0 ? (
                  <motion.span
                    key={badge}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1], rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 0.4,
                      type: 'spring',
                      stiffness: 500,
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold"
                  >
                    {badge > 9 ? '9+' : badge}
                  </motion.span>
                ) : null}
              </motion.div>

              <span
                className={clsx(
                  'text-xs mt-1 text-center',
                  isActive && activeClass,
                  isActive && 'font-semibold',
                  !isActive && 'text-gray-500'
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
