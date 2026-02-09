import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import { useWiseAppNav } from '../contexts/WiseAppContext';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  /** Tailwind bg class for the active indicator only (e.g. 'bg-carnival-orange') */
  indicatorColor: string;
}

type Variant = 'sidebar' | 'bottom';

interface NavigationProps {
  items: NavItem[];
  variant: Variant;
}

const layoutIds = { sidebar: 'nav-indicator-sidebar', bottom: 'nav-indicator-bottom' } as const;

export function Navigation({ items, variant }: NavigationProps) {
  const { isActive } = useWiseAppNav();
  const isBottom = variant === 'bottom';

  const wrapperClass = isBottom
    ? 'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_2px_rgba(0,0,0,0.08)] z-50 md:hidden safe-area-inset-bottom'
    : 'hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-gray-200 shadow-lg z-40';

  const containerClass = isBottom
    ? 'flex justify-around items-center h-16 max-w-screen-xl mx-auto px-safe relative'
    : 'flex flex-col items-center pt-6 pb-4 gap-1 flex-1';

  const linkClass = isBottom
    ? 'flex flex-col items-center justify-center flex-1 min-w-0 h-full relative transition-colors'
    : clsx(
        'flex flex-col items-center justify-center w-full py-3 px-2 relative transition-colors rounded-r-lg',
        'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
      );

  const indicatorClass = isBottom
    ? 'absolute -top-1 left-0 right-0 w-8 h-1 rounded-full mx-auto'
    : 'absolute left-0 top-0 bottom-0 w-1 rounded-r-full';

  const iconSize = isBottom ? 24 : 22;
  const labelClass = isBottom
    ? 'text-xs mt-1 text-center'
    : 'text-[10px] mt-1.5 text-center leading-tight font-medium';

  const activeTextClass = 'text-gray-900 font-semibold';
  const inactiveTextClass = 'text-gray-500';

  const Wrapper = isBottom ? 'nav' : 'aside';

  return (
    <Wrapper className={wrapperClass}>
      <div className={containerClass}>
        {items.map(({ path, label, icon: Icon, badge, indicatorColor }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className={clsx(
                linkClass,
                active && !isBottom && 'bg-gray-100/80 text-gray-900'
              )}
            >
              {active ? (
                <motion.div
                  layoutId={layoutIds[variant]}
                  className={clsx(indicatorClass, indicatorColor)}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              ) : null}

              {isBottom ? (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={active ? { y: [0, -4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  className="relative flex flex-col items-center"
                >
                  <Icon
                    size={iconSize}
                    className={clsx(
                      active && 'stroke-2',
                      active ? activeTextClass : inactiveTextClass
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
              ) : (
                <div className="relative">
                  <Icon
                    size={iconSize}
                    className={clsx(active && 'stroke-2', active ? activeTextClass : inactiveTextClass)}
                  />
                  {badge != null && badge > 0 ? (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center font-bold">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  ) : null}
                </div>
              )}

              <span
                className={clsx(
                  labelClass,
                  active ? activeTextClass : inactiveTextClass
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </Wrapper>
  );
}
