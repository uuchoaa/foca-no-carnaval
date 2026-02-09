import type { ReactNode } from 'react';
import { Text } from '../primitives/Text';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  return (
    <div
      className={className}
      role="status"
      aria-label={title}
    >
      {icon ? <div className="flex justify-center mb-4">{icon}</div> : null}
      <Text variant="heading2" className="text-gray-700 mb-2 block text-center">
        {title}
      </Text>
      {description ? (
        <p className="text-gray-500 text-center text-sm">{description}</p>
      ) : null}
    </div>
  );
}
