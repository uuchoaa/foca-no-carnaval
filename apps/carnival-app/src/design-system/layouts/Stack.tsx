import type { ReactNode } from 'react';
import clsx from 'clsx';

type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

const gapClass: Record<Gap, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
};

const alignClass: Record<Align, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyClass: Record<Justify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

interface StackProps {
  direction: 'row' | 'column';
  children: ReactNode;
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  className?: string;
}

function Stack({
  direction,
  children,
  gap = 2,
  align,
  justify,
  className,
}: StackProps) {
  return (
    <div
      className={clsx(
        'flex',
        direction === 'row' ? 'flex-row' : 'flex-col',
        gapClass[gap],
        align && alignClass[align],
        justify && justifyClass[justify],
        className
      )}
    >
      {children}
    </div>
  );
}

interface HStackProps extends Omit<StackProps, 'direction'> {}
interface VStackProps extends Omit<StackProps, 'direction'> {}

export function HStack(props: HStackProps) {
  return <Stack {...props} direction="row" />;
}

export function VStack(props: VStackProps) {
  return <Stack {...props} direction="column" />;
}
