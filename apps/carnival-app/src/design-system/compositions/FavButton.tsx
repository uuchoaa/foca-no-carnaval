import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FavButtonProps {
  icon: LucideIcon;
  isFavorite: boolean;
  onToggle: () => void;
}

export function FavButton({ icon: Icon, isFavorite, onToggle }: FavButtonProps) {
  return (
    <button
      onClick={onToggle}
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
      <motion.div
        animate={{
          scale: isFavorite ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <Icon
          size={24}
          fill={isFavorite ? 'white' : 'none'}
          style={{ transition: 'fill 0.2s' }}
        />
      </motion.div>
    </button>
  );
}
