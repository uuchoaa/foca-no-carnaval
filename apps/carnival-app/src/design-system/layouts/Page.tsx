import type { ReactNode } from 'react';
import { pageHeaderGradients, type PageHeaderGradient } from '../tokens/gradients';

interface PageProps {
  children: ReactNode;
}

export function Page({ children }: PageProps) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  gradient: PageHeaderGradient;
  title: string;
  children: ReactNode;
}

function PageHeader({ gradient, children }: PageHeaderProps) {
  const gradientClass = pageHeaderGradients[gradient];
  return (
    <div
      className={gradientClass}
      style={{
        color: 'white',
        padding: '24px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          padding: '0 16px',
        }}
      >
        AQUI!
        {children}
      </div>
    </div>
  );
}

function PageHeaderActions({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  );
}

PageHeader.Actions = PageHeaderActions;

interface PageContentProps {
  children: ReactNode;
  center?: boolean;
}

function PageContent({ children, center }: PageContentProps) {
  return (
    <div
      style={{
        padding: '16px 24px 32px',
        maxWidth: '1280px',
        margin: '0 auto',
        ...(center && {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }),
      }}
    >
      {children}
    </div>
  );
}

interface PageFooterProps {
  children: ReactNode;
}

function PageFooter({ children }: PageFooterProps) {
  return <footer>{children}</footer>;
}

Page.Header = PageHeader;
Page.Content = PageContent;
Page.Footer = PageFooter;
