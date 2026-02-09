import { Mic2 } from 'lucide-react';
import { Show } from '../design-system';

interface ArtistInfoProps {
  artist: string;
  origin?: string;
}

export default function ArtistInfo({ artist, origin }: ArtistInfoProps) {
  return (
    <div className="flex items-center gap-2 text-lg opacity-90">
      <Mic2 size={20} />
      <span>{artist}</span>
      <Show condition={!!origin}>
        <span className="text-sm bg-white/20 px-2 py-0.5 rounded">{origin}</span>
      </Show>
    </div>
  );
}
