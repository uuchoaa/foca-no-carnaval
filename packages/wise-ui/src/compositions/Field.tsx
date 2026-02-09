import { Input } from '../primitives/Input';
import { Text } from '../primitives/Text';

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Field({ label, value, onChange, placeholder }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Text variant="small" className="font-medium text-gray-700">
        {label}
      </Text>
      <Input value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}
