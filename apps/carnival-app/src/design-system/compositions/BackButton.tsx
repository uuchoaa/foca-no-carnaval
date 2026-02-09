import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';

export function BackButton() {
  const { goBack } = useNavigation();

  return (
    <button
      onClick={goBack}
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
