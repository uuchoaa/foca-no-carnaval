export function EventTitle({ children }: { children: string }) {
  return (
    <h1
      style={{
        color: 'white',
        fontSize: '32px',
        fontWeight: 700,
        marginBottom: '8px',
        lineHeight: 1.2,
      }}
    >
      {children}
    </h1>
  );
}
