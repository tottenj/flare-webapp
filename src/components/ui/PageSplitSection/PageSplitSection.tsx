import type { ReactNode } from 'react';

import PageHeading from '@/components/ui/PageHeading/PageHeading';

type PageSplitSectionProps = {
  heading: ReactNode;
  subText?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
  contentRatio?: 'equal' | 'wide';
};

export default function PageSplitSection({
  heading,
  subText,
  children,
  contentClassName,
  contentRatio = 'equal',
}: PageSplitSectionProps) {
  const columnLayout =
    contentRatio === 'wide' ? 'md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]' : 'md:grid-cols-2';

  return (
    <section className={`grid grid-cols-1 gap-8 ${columnLayout}`}>
      <PageHeading headingLevel={2} headingSize="sm" subText={subText}>
        {heading}
      </PageHeading>
      <div className={`min-w-0 ${contentClassName ?? ''}`}>{children}</div>
    </section>
  );
}
