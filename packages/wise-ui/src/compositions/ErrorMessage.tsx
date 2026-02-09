export function ErrorMessage({ message }: { message: string }) {
  return (
    <span
      style={{
        color: '#6b7280',
        fontSize: '18px',
        display: 'block',
        marginBottom: '16px',
      }}
    >
      {message}
    </span>
  );
}
