import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Show } from '../primitives/Show';

interface Source {
  id: string;
  url?: string;
}

interface SourceListProps {
  sources: Source[];
}

export function SourceList({ sources }: SourceListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {sources.map((source, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '14px', color: '#374151' }}>{source.id}</span>
          <Show condition={!!source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
              }}
            >
              <ExternalLink size={16} />
            </a>
          </Show>
        </motion.div>
      ))}
    </div>
  );
}
