import { Label as HeroUILabel } from '@heroui/react';
import type { ComponentProps } from 'react';

export type LabelProps = ComponentProps<typeof HeroUILabel>;

export default function Label(props: LabelProps) {
  return <HeroUILabel {...props} />;
}
