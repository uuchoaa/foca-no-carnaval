import type { ReactNode } from 'react';
import { Show } from '../primitives/Show';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div role="status" aria-label={title}>
      <Show condition={!!icon}>
        <div className="flex justify-center mb-4">{icon}</div>
      </Show>

      <h2 className="text-gray-700 mb-2 block text-center">
        {title}
      </h2>

      <Show condition={!!description}>
        <p className="text-gray-500 text-center text-sm">{description}</p>
      </Show>
    </div>
  );
}
