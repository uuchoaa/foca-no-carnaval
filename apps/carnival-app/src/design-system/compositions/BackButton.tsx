import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onGoBack: () => void;
}

export function BackButton({ onGoBack }: BackButtonProps) {
  return (
    <button
      onClick={onGoBack}
      style={{
        padding: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      }}
    >
      <ArrowLeft size={24} />
    </button>
  );
}
