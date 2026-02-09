import clsx from 'clsx';

type ChipColor = 'orange' | 'purple' | 'blue' | 'green' | 'gray';

export interface ChipOption {
  id: string;
  label: string;
  color?: ChipColor;
}

interface ChipGroupProps {
  label: string;
  options: ChipOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const colorClasses: Record<ChipColor, string> = {
  orange: 'bg-orange text-white',
  purple: 'bg-purple text-white',
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  gray: 'bg-gray-700 text-white',
};

export function ChipGroup({ label, options, selectedIds, onToggle }: ChipGroupProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedIds.includes(opt.id);
          const color = opt.color ?? 'orange';
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onToggle(opt.id)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize',
                isSelected ? colorClasses[color] : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
