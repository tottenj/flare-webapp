import { NumberInput, NumberInputProps } from '@heroui/react';

interface heroNumberInputProps extends NumberInputProps {}
export default function HeroNumberInput({ ...props }: heroNumberInputProps) {
  return <NumberInput data-cy={`${props.name ?? "price"}-input`} className='rounded-none' classNames={{ inputWrapper: "rounded-2xl"}} {...props} />;
}
