import { Badge } from '../primitives/Badge';

type BadgeColor = 'orange' | 'purple' | 'blue' | 'green' | 'gray';

export interface TagItem {
  label: string;
  color?: BadgeColor;
}

interface TagListProps {
  tags: TagItem[];
}

export function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <Badge key={t.label} color={t.color ?? 'gray'}>
          {t.label}
        </Badge>
      ))}
    </div>
  );
}
