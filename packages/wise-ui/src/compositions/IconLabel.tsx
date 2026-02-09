import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { HStack } from '../layouts/Stack';
import { semantic } from '../tokens/colors';

type IconColor = 'primary' | 'muted';

const iconColorMap: Record<IconColor, string> = {
  primary: semantic.primary,
  muted: '#6b7280',
};

interface IconLabelProps {
  icon: LucideIcon;
  iconColor?: IconColor;
  iconSize?: number;
  children: ReactNode;
}

export function IconLabel({
  icon: Icon,
  iconColor = 'primary',
  iconSize = 12,
  children,
}: IconLabelProps) {
  return (
    <HStack gap={2} align="center">
      <Icon size={iconSize} style={{ color: iconColorMap[iconColor], flexShrink: 0 }} />
      {children}
    </HStack>
  );
}
