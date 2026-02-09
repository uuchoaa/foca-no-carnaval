import type { ReactNode } from 'react';
import { Card } from '../primitives/Card';
import type { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

export function InfoCard({ icon: Icon, title, children }: InfoCardProps) {
  return (
    <Card variant="default">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#6b7280',
          marginBottom: '12px',
        }}
      >
        <Icon size={20} />
        <span style={{ fontWeight: 500 }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{children}</div>
    </Card>
  );
}
