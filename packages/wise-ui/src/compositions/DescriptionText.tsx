export function DescriptionText({ children }: { children: string }) {
  return (
    <p
      style={{
        color: '#374151',
        lineHeight: 1.6,
        fontSize: '16px',
      }}
    >
      {children}
    </p>
  );
}
