import HeroNumberInput from '@/components/inputs/hero/number/HeroNumberInput';
import type { ComponentProps } from 'react';

export default function PriceInput({ ...props }: ComponentProps<typeof HeroNumberInput>) {
  return <HeroNumberInput minValue={1} {...props} placeholder="$1.00" />;
}
