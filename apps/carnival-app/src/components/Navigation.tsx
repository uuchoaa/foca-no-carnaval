import { Home, Mic2, Map, Heart } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { AppLayout, type NavItem } from '../design-system';

export default function Navigation({ children }: { children: React.ReactNode }) {
  const { count } = useFavorites();

  const navItems: NavItem[] = [
    {
      path: '/blocos',
      label: 'Blocos',
      icon: Home,
      activeClass: 'text-carnival-orange',
      activeBg: 'bg-carnival-orange',
    },
    {
      path: '/shows',
      label: 'Shows',
      icon: Mic2,
      activeClass: 'text-carnival-purple',
      activeBg: 'bg-carnival-purple',
    },
  ];

  return <AppLayout navItems={navItems}>{children}</AppLayout>;
}
