import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../primitives/Card';
import clsx from 'clsx';

interface FilterPanelProps {
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  activeCount?: number;
  children: ReactNode;
}

export function FilterPanel({
  icon: Icon,
  isOpen,
  onToggle,
  activeCount = 0,
  children,
}: FilterPanelProps) {
  return (
    <Card variant="muted">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-orange" />
          <span className="font-medium text-gray-900">Filtros</span>
          {activeCount > 0 ? (
            <span className="bg-orange text-white text-xs px-2 py-0.5 rounded-full font-medium">
              {activeCount}
            </span>
          ) : null}
        </div>
        <span
          className={clsx('text-gray-500 transition-transform', isOpen && 'rotate-180')}
          aria-hidden
        >
          ▼
        </span>
      </button>
      <div
        className={clsx(
          'overflow-hidden transition-[height] duration-300 ease-in-out',
          isOpen ? 'max-h-[800px]' : 'max-h-0'
        )}
      >
        <div className="px-4 pb-4 pt-4 border-t border-gray-200 space-y-4">{children}</div>
      </div>
    </Card>
  );
}
