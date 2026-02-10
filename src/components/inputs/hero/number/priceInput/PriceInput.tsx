import HeroNumberInput from '@/components/inputs/hero/number/HeroNumberInput';
import { NumberInputProps } from '@heroui/react';

export default function PriceInput({ ...props }: NumberInputProps) {
  return (
    <HeroNumberInput
      minValue={1}
      {...props}
      placeholder="$1.00"
      formatOptions={{
        style: 'currency',
        currency: 'USD',
      }}
    />
  );
}
