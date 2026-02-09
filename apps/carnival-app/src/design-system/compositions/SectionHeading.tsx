import { Show } from '../primitives/Show';
import { Text } from '../primitives/Text';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="flex flex-col">
      <Text variant="title">{title}</Text>

      <Show condition={!!subtitle}>
        <Text variant="subtitle">{subtitle}</Text>
      </Show>
    </div>
  );
}
