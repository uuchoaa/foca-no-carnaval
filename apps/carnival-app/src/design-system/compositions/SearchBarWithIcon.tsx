import { Search, X } from 'lucide-react';
import { Input } from '../primitives/Input';

interface SearchBarWithIconProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBarWithIcon({
  value,
  onChange,
  placeholder = 'Buscar blocos...',
}: SearchBarWithIconProps) {
  const handleClear = () => onChange('');

  return (
    <div className="relative h-fit">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
        size={20}
      />
      <div className="[&_input]:pl-10 [&_input]:pr-10 [&_input]:py-3">
        <Input value={value} onChange={onChange} placeholder={placeholder} />
      </div>
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpar"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={20} />
        </button>
      ) : null}
    </div>
  );
}
