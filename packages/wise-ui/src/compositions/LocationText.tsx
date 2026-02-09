interface LocationTextProps {
  children: string;
  variant?: 'primary' | 'secondary' | 'small';
}

export function LocationText({ children, variant = 'primary' }: LocationTextProps) {
  const styles = {
    primary: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#111827',
      display: 'block',
    },
    secondary: {
      fontSize: '16px',
      color: '#374151',
      display: 'block',
    },
    small: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '4px',
      display: 'block',
    },
  };

  return <span style={styles[variant]}>{children}</span>;
}
