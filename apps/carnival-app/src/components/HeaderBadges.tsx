interface HeaderBadgesProps {
  eventType: 'bloco' | 'show';
  city: 'recife' | 'olinda';
}

export function HeaderBadges({ eventType, city }: HeaderBadgesProps) {
  const cityLabel = city === 'recife' ? 'Recife' : 'Olinda';
  const eventLabel = eventType === 'bloco' ? 'BLOCO' : 'SHOW';

  const badgeStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontWeight: 500,
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    display: 'inline-block' as const,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      <span style={badgeStyle}>{eventLabel}</span>
      <span style={badgeStyle}>{cityLabel}</span>
    </div>
  );
}
