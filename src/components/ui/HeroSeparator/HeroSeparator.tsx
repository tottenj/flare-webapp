import { Separator } from '@heroui/react';
import type { ComponentProps } from 'react';

export type HeroSeparatorProps = ComponentProps<typeof Separator>;

export default function HeroSeparator(props: HeroSeparatorProps) {
  return <Separator {...props} />;
}
