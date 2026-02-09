import clsx from 'clsx';
import { Text } from '../primitives/Text';
import { semantic } from '../tokens/colors';

type SpinnerVariant = keyof typeof semantic;

interface LoadingSpinnerProps {
  message?: string;
  variant?: SpinnerVariant;
}

export function LoadingSpinner({
  message = 'Carregando...',
  variant = 'primary',
}: LoadingSpinnerProps) {
  return (
    <div className="text-center py-12" role="status" aria-label={message}>
      <div
        className={clsx(
          'animate-spin rounded-full h-12 w-12 border-b-2 mx-auto',
          semantic[variant]
        )}
      />
      <Text variant="body">
        {message}
      </Text>
    </div>
  );
}
