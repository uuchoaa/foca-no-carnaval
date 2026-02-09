import type { LucideIcon } from 'lucide-react';

interface FavButtonProps {
  icon: LucideIcon;
  isActive: boolean;
  onToggle: () => void;
  iconSize?: number;
}

export function FavButton({
  icon: Icon,
  isActive,
  onToggle,
  iconSize = 20,
}: FavButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="flex-shrink-0 p-1 -m-1 text-gray-400 hover:text-gray-600 cursor-pointer"
      aria-label={isActive ? 'Desfavoritar' : 'Favoritar'}
    >
      <Icon size={iconSize} fill={isActive ? 'currentColor' : 'none'} />
    </button>
  );
}
