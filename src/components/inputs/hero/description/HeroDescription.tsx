import { Description } from '@heroui/react';
import type { ComponentProps } from 'react';

export type HeroDescriptionProps = Omit<ComponentProps<typeof Description>, 'className'> & {
  className?: string;
};

export default function HeroDescription({ className, ...props }: HeroDescriptionProps) {
  return <Description {...props} className={`text-muted text-sm ${className ?? ''}`} />;
}
