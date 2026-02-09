import clsx from 'clsx';
import { Text } from '../primitives/Text';

type SpinnerVariant = 'orange' | 'purple';

interface LoadingSpinnerProps {
  message?: string;
  variant?: SpinnerVariant;
  className?: string;
}

const variantBorder: Record<SpinnerVariant, string> = {
  orange: 'border-carnival-orange',
  purple: 'border-carnival-purple',
};

export function LoadingSpinner({
  message = 'Carregando...',
  variant = 'orange',
  className,
}: LoadingSpinnerProps) {
  return (
    <div className={clsx('text-center py-12', className)} role="status" aria-label={message}>
      <div
        className={clsx(
          'animate-spin rounded-full h-12 w-12 border-b-2 mx-auto',
          variantBorder[variant]
        )}
      />
      <Text variant="body" className="text-gray-500 mt-4 block">
        {message}
      </Text>
    </div>
  );
}
