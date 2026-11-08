import { Button } from '@heroui/react';
import type { ComponentProps } from 'react';

export type HeroButtonProps = ComponentProps<typeof Button>;

export default function HeroButton(props: HeroButtonProps) {
  return <Button {...props} />;
}
