import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Button } from '../primitives/Button';

export interface TabOption {
  id: string;
  label: ReactNode;
  selectedStyle?: 'all' | 'orange' | 'purple';
}

interface TabGroupProps {
  options: TabOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function TabGroup({ options, selectedId, onSelect }: TabGroupProps) {
  return (
    <div className="p-4 md:px-6 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex gap-2 max-w-screen-xl mx-auto">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const style = opt.selectedStyle ?? 'all';
          const selectedClass =
            style === 'all'
              ? '!bg-gray-900 text-white'
              : style === 'orange'
                ? '!bg-carnival-orange text-white'
                : '!bg-carnival-purple text-white';
          return (
            <Button
              key={opt.id}
              variant={isSelected ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onSelect(opt.id)}
              className={clsx(
                'flex-1',
                isSelected && selectedClass
              )}
            >
              {opt.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
