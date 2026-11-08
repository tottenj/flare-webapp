import type { ComponentProps } from 'react';

import HeroSeparator from './HeroSeparator';

export type HeroSeparatorWithContentProps = ComponentProps<'div'>;

export default function HeroSeparatorWithContent({
  children,
  className,
  ...props
}: HeroSeparatorWithContentProps) {
  return (
    <div {...props} className={`flex w-full items-center gap-3 ${className ?? ''}`}>
      <HeroSeparator isDecorative className="min-w-0 flex-1" />
      <span className="shrink-0">{children}</span>
      <HeroSeparator isDecorative className="min-w-0 flex-1" />
    </div>
  );
}
