export function EventDate({ children }: { children: string }) {
  return (
    <span
      style={{
        fontSize: '18px',
        fontWeight: 600,
        color: '#111827',
        textTransform: 'capitalize',
        display: 'block',
      }}
    >
      {children}
    </span>
  );
}
