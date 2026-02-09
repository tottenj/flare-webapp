import { Checkbox, CheckboxProps } from '@heroui/react';

interface heroCheckBoxProps extends CheckboxProps {}

export default function HeroCheckBox({ children, ...props }: heroCheckBoxProps) {
  return (
    <Checkbox {...props}>
      {children}
    </Checkbox>
  );
}
