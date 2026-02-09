import clsx from 'clsx';
import { Text } from '../primitives/Text';
import { Show } from '../primitives/Show';

export interface DateChipItem {
  id: string | null;
  label: string;
  sublabel?: string;
}

interface DateChipRowProps {
  label?: string;
  items: DateChipItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  variant?: 'orange' | 'purple';
}

export function DateChipRow({
  label = 'Data',
  items,
  selectedId,
  onSelect,
  variant = 'orange',
}: DateChipRowProps) {
  const selectedStyle =
    variant === 'orange' ? '!bg-gray-900 text-white' : '!bg-gray-900 text-white';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col h-fit">
      <Text variant="chip">{label}</Text>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id ?? 'all'}
              type="button"
              onClick={() => onSelect(item.id)}
              className={clsx(
                'flex-shrink-0 flex flex-col items-center justify-center min-w-[60px] px-3 py-2 rounded-lg transition-colors',
                isSelected ? selectedStyle : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <Show condition={!!item.sublabel} fallback={
                <span className="text-sm font-medium">{item.label}</span>}
              >
                <>
                  <span className="text-xs uppercase font-medium opacity-80">
                    {item.sublabel}
                  </span>
                  <span className="text-lg font-bold">{item.label}</span>
                </>
              </Show>
            </button>
          );
        })}
      </div>
    </div>
  );
}
