import clsx from 'clsx';
import { Text } from '../primitives/Text';

type SpinnerVariant = 'orange' | 'purple';

interface LoadingSpinnerProps {
  message?: string;
  variant?: SpinnerVariant;
}

const variantBorder: Record<SpinnerVariant, string> = {
  orange: 'border-orange',
  purple: 'border-purple',
};

export function LoadingSpinner({
  message = 'Carregando...',
  variant = 'orange',
}: LoadingSpinnerProps) {
  return (
    <div className="text-center py-12" role="status" aria-label={message}>
      <div
        className={clsx(
          'animate-spin rounded-full h-12 w-12 border-b-2 mx-auto',
          variantBorder[variant]
        )}
      />
      <Text variant="body">
        {message}
      </Text>
    </div>
  );
}
