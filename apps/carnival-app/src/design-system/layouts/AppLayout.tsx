import type { ReactNode } from 'react';
import { Navigation, type NavItem } from './Navigation';

interface AppLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
}

export function AppLayout({ children, navItems }: AppLayoutProps) {
  return (
    <>
      <Navigation variant="sidebar" items={navItems} />
      <main className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:ml-20">
        {children}
      </main>
      <Navigation variant="bottom" items={navItems} />
    </>
  );
}
