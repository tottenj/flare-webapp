import type { InputHTMLAttributes, ReactNode } from 'react';

interface HeroCheckBoxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  children?: ReactNode;
  isSelected?: boolean;
  onValueChange?: (selected: boolean) => void;
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange'];
}

export default function HeroCheckBox({
  children,
  isSelected,
  onValueChange,
  onChange,
  ...props
}: HeroCheckBoxProps) {
  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        data-cy={`${props.name ?? 'checkbox'}-input`}
        checked={isSelected ?? props.checked}
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.currentTarget.checked);
        }}
        {...props}
      />
      {children}
    </label>
  );
}
