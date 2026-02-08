import clsx from 'clsx';
import { Badge } from '../primitives/Badge';

type BadgeColor = 'orange' | 'purple' | 'blue' | 'green' | 'gray';

export interface TagItem {
  label: string;
  color?: BadgeColor;
}

interface TagListProps {
  tags: TagItem[];
  className?: string;
}

export function TagList({ tags, className }: TagListProps) {
  return (
    <div className={clsx('flex flex-wrap gap-2', className)}>
      {tags.map((t) => (
        <Badge key={t.label} color={t.color ?? 'gray'}>
          {t.label}
        </Badge>
      ))}
    </div>
  );
}
