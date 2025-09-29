import { Select, SelectProps } from '@heroui/react';

export interface HeroSelectProps extends SelectProps {}

export default function HeroSelect(props: HeroSelectProps) {
  return (
    <Select
      isRequired={props.required}
      classNames={{
        innerWrapper: 'py-2 pb-4',
        listbox: 'rounded-lg bg-tertiary', // removes rounded corners from options container
        popoverContent: 'rounded-none', // removes rounding on the dropdown itself
      }}
      radius={props.radius || 'sm'}
      labelPlacement={props.labelPlacement || 'inside'}
      {...props}
    >
      {props.children}
    </Select>
  );
}
