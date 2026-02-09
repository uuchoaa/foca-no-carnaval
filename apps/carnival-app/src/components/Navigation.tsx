import { Home, Mic2 } from 'lucide-react';
import { AppLayout, type NavItem } from '../design-system';

export default function Navigation({ children }: { children: React.ReactNode }) {
  const navItems: NavItem[] = [
    {
      path: '/blocos',
      label: 'Blocos',
      icon: Home,
      indicatorColor: 'bg-carnival-orange',
    },
    {
      path: '/shows',
      label: 'Shows',
      icon: Mic2,
      indicatorColor: 'bg-carnival-purple',
    },
  ];

  return <AppLayout navItems={navItems}>{children}</AppLayout>;
}
