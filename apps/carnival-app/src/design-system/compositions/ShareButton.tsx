import type { LucideIcon } from 'lucide-react';

interface ShareButtonProps {
  icon: LucideIcon;
}

export function ShareButton({ icon: Icon }: ShareButtonProps) {
  return (
    <button
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        backgroundColor: 'white',
        color: '#374151',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '16px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f9fafb';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'white';
      }}
    >
      <Icon size={20} />
      Compartilhar evento
    </button>
  );
}
