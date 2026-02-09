import { Clock } from 'lucide-react';

interface TimeInfoProps {
  time: string;
  label?: string;
  variant: 'bloco' | 'show';
  emphasis?: boolean;
}

export function TimeInfo({ time, label, variant, emphasis = false }: TimeInfoProps) {
  const color = variant === 'bloco' ? '#f97316' : '#9333ea';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginLeft: emphasis ? 0 : '28px',
      }}
    >
      {emphasis && <Clock size={18} style={{ color }} />}
      <span
        style={{
          fontSize: emphasis ? '24px' : '18px',
          fontWeight: emphasis ? 700 : 600,
          color: emphasis ? color : '#374151',
        }}
      >
        {time}
      </span>
      {label && <span style={{ fontSize: '14px', color: '#6b7280' }}>{label}</span>}
    </div>
  );
}
