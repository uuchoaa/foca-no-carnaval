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

interface NavigationSidebarProps {
  items: NavItem[];
}

export function NavigationSidebar({ items }: NavigationSidebarProps) {
  const { isActive } = useActiveNav();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-20 bg-gray-900 z-40 shadow-xl">
      <div className="flex flex-col items-center pt-6 pb-4 gap-1 flex-1">
        {items.map(({ path, label, icon: Icon, badge, activeBg }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className={clsx(
                'flex flex-col items-center justify-center w-full py-3 px-2 relative transition-colors rounded-r-lg',
                active
                  ? 'bg-gray-800/80 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              )}
            >
              {active ? (
                <motion.div
                  layoutId="sidebar-indicator"
                  className={clsx(
                    'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full',
                    activeBg
                  )}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              ) : null}
              <div className="relative">
                <Icon
                  size={22}
                  className={clsx(active && 'stroke-2')}
                />
                {badge != null && badge > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-carnival-pink text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center font-bold">
                    {badge > 9 ? '9+' : badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1.5 text-center leading-tight font-medium">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
