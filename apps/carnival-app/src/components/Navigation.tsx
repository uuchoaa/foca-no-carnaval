import { Home, Mic2, Sparkles } from 'lucide-react';
import { AppLayout, type NavItem } from 'wise-ui';

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
    {
      path: '/explorar',
      label: 'Explorar',
      icon: Sparkles,
      indicatorColor: 'bg-purple-500',
    },
  ];

  return <AppLayout navItems={navItems}>{children}</AppLayout>;
}
