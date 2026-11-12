import { buttonVariants } from '@heroui/react';
import type { ComponentProps } from 'react';
import type { VariantProps } from 'tailwind-variants';
import Link from 'next/link';

export type LinkButtonProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

export default function LinkButton({ className, ...props }: LinkButtonProps) {
  const { fullWidth, isIconOnly, size, variant, ...linkProps } = props;

  return (
    <Link
      {...linkProps}
      className={buttonVariants({ className, fullWidth, isIconOnly, size, variant })}
    />
  );
}
