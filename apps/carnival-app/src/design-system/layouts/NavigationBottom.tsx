import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import { useActiveNav } from '../contexts/ActiveNavContext';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  activeClass: string;
  activeBg: string;
}

interface NavigationBottomProps {
  items: NavItem[];
}

export function NavigationBottom({ items }: NavigationBottomProps) {
  const { isActive } = useActiveNav();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_2px_rgba(0,0,0,0.08)] z-50 md:hidden safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-safe relative">
        {items.map(({ path, label, icon: Icon, badge, activeClass, activeBg }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className="flex flex-col items-center justify-center flex-1 min-w-0 h-full relative transition-colors"
            >
              {active ? (
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
                animate={active ? { y: [0, -4, 0] } : {}}
                transition={{ duration: 0.3 }}
                className="relative flex flex-col items-center"
              >
                <Icon
                  size={24}
                  className={clsx(
                    active && activeClass,
                    active && 'stroke-2',
                    !active && 'text-gray-500'
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
                  active && activeClass,
                  active && 'font-semibold',
                  !active && 'text-gray-500'
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
