import { Text } from '../primitives/Text';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={className}>
      <Text variant="heading2" className="text-gray-900 block capitalize">
        {title}
      </Text>
      {subtitle ? (
        <Text variant="small" className="text-gray-500 capitalize block">
          {subtitle}
        </Text>
      ) : null}
    </div>
  );
}
