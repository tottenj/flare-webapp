import type { ReactNode } from 'react';

import HeroSeparator from '@/components/ui/HeroSeparator/HeroSeparator';

const headingSizes = {
  xs: 'text-lg',
  sm: 'text-xl',
  md: 'text-3xl',
  lg: 'text-4xl sm:text-5xl',
} as const;

type PageHeadingProps = {
  children: ReactNode;
  accentText?: ReactNode;
  subText?: ReactNode;
  withSeparator?: boolean;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 'p';
  headingSize?: keyof typeof headingSizes;
};

export default function PageHeading({
  children,
  accentText,
  subText,
  withSeparator = false,
  headingLevel = 1,
  headingSize = 'lg',
}: PageHeadingProps) {
  const Heading = headingLevel === 'p' ? 'p' : (`h${headingLevel}` as const);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        {accentText != null && <p className="text-accent font-bold uppercase">{accentText}</p>}
        <Heading className={`font-heading font-bold ${headingSizes[headingSize]}`}>
          {children}
        </Heading>
      </div>
      {subText != null && <p className="text-muted text-base">{subText}</p>}
      {withSeparator && <HeroSeparator />}
    </div>
  );
}
