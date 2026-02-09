import { Checkbox } from '../primitives/Checkbox';

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <Checkbox checked={checked} onChange={onChange} />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
