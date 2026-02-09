import type { InputHTMLAttributes } from 'react';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
      {...props}
    />
  );
}
