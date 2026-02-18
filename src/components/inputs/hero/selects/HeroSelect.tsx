import { Select, SelectItem, SelectProps } from '@heroui/react';

export interface HeroSelectProps<T extends object> extends SelectProps<T> {}

export default function HeroSelect<T extends object>({ children, ...props }: HeroSelectProps<T>) {
  return (
    <Select
      classNames={{
        innerWrapper: 'rounded-none !pt-0',
        base: 'rounded-none',
        trigger: 'rounded-2xl h-auto',
        popoverContent: 'rounded-sm',
       
      }}
      {...props}
    >
      {children}
    </Select>
  );
}

HeroSelect.Item = SelectItem;
