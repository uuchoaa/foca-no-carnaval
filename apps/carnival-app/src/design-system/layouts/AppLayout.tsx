import type { ReactNode } from 'react';
import { NavigationSidebar, type NavItem } from './NavigationSidebar';
import { NavigationBottom } from './NavigationBottom';

interface AppLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
}

export function AppLayout({ children, navItems }: AppLayoutProps) {
  return (
    <>
      <NavigationSidebar items={navItems} />
      <main className="min-h-screen bg-gray-50 pb-20 md:pb-0 md:ml-20">
        {children}
      </main>
      <NavigationBottom items={navItems} />
    </>
  );
}
