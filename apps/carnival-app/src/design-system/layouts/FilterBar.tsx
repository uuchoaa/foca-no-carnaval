import type { ReactNode } from 'react';

interface FilterBarProps {
  children: ReactNode;
}

export function FilterBar({ children }: FilterBarProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-4 md:px-6 md:py-5 mb-6 max-w-screen-xl mx-auto bg-white/90 md:bg-white border-b border-gray-100 shadow-sm [&>*]:min-w-0 [&>*]:flex [&>*]:flex-col [&>*]:justify-between"
    >
      {children}
    </div>
  );
}
