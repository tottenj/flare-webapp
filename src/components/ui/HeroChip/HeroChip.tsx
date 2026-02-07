import { Chip, ChipProps } from "@heroui/react";
import clsx from 'clsx';

interface HeroChipProps extends ChipProps {}

export default function HeroChip({className, variant="flat", children, ...props}: HeroChipProps) {
  return (
    <Chip variant={variant} className={clsx('border border-default-200', className)}{...props}>{children}</Chip>
  )
}