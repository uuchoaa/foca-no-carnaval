import { Card } from '../primitives/Card';
import { Text } from '../primitives/Text';
import type { TagItem } from './TagList';
import { TagList } from './TagList';

interface EventCardPreviewProps {
  title: string;
  tags?: TagItem[];
  meta?: string;
  variant?: 'default' | 'highlight' | 'muted';
}

export function EventCardPreview({
  title,
  tags = [],
  meta,
  variant = 'default',
}: EventCardPreviewProps) {
  return (
    <Card variant={variant}>
      <div className="flex flex-col gap-2">
        <Text variant="heading2">{title}</Text>
        {tags.length > 0 && <TagList tags={tags} />}
        {meta && (
          <Text variant="caption" className="text-gray-500">
            {meta}
          </Text>
        )}
      </div>
    </Card>
  );
}
