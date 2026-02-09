import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { pageHeaderGradients, type PageHeaderGradient } from '../tokens/gradients';
import { Text } from '../primitives/Text';
import { Show } from '../primitives/Show';
import { LoadingSpinner } from '../compositions/LoadingSpinner';
import { EmptyState } from '../compositions/EmptyState';

interface PageProps {
  children: ReactNode;
}

export function Page({ children }: PageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}
    >
      {children}
    </motion.div>
  );
}

interface PageHeaderProps {
  gradient: PageHeaderGradient;
  title: string;
  subtitle: string;
}

function PageHeader({ gradient, title, subtitle }: PageHeaderProps) {
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
        <Text variant="title">
          {title}
        </Text>
        <Text variant="subtitle">
          {subtitle}
        </Text>
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

// TODO: create a context for translations
const DEFAULT_EMPTY_TITLE = 'Nenhum item';
const DEFAULT_EMPTY_DESCRIPTION = 'Tente ajustar os filtros';

interface PageContentProps {
  children: ReactNode;
  center?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
}

function PageContent({ children, center, isLoading, isEmpty }: PageContentProps) {
  const showEmpty = Boolean(isEmpty && !isLoading);
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
      <Show condition={!!isLoading} fallback={null}>
        <LoadingSpinner />
      </Show>
      <Show condition={!isLoading && showEmpty} fallback={null}>
        <PageEmptyState
          title={DEFAULT_EMPTY_TITLE}
          description={DEFAULT_EMPTY_DESCRIPTION}
        />
      </Show>
      <Show condition={!isLoading && !showEmpty} fallback={null}>
        {children}
      </Show>
    </div>
  );
}

interface PageFooterProps {
  children: ReactNode;
}

function PageFooter({ children }: PageFooterProps) {
  return <footer>{children}</footer>;
}

interface PageEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

function PageEmptyState({ icon, title, description }: PageEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="py-12"
    >
      <EmptyState icon={icon} title={title} description={description} />
    </motion.div>
  );
}

Page.Header = PageHeader;
Page.Content = PageContent;
Page.Footer = PageFooter;
Page.EmptyState = PageEmptyState;
