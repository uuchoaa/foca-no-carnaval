import { useNavigation } from '../hooks/useNavigation';

export function MapButton() {
  const { goTo } = useNavigation();

  return (
    <button
      onClick={() => goTo('/map')}
      style={{
        marginTop: '12px',
        width: '100%',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.9';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
    >
      Ver no mapa
    </button>
  );
}
