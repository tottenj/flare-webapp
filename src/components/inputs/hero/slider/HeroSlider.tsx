'use client';

import type { InputHTMLAttributes } from 'react';

interface HeroSliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> {
  value?: number | number[];
  minValue?: number;
  maxValue?: number;
  isDisabled?: boolean;
  onChange?: (value: number | number[]) => void;
  onChangeEnd?: (value: number | number[]) => void;
  getValue?: (value: number) => string;
  showTooltip?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
}

export default function HeroSlider({
  value,
  minValue,
  maxValue,
  isDisabled,
  onChange,
  onChangeEnd,
  ...props
}: HeroSliderProps) {
  const numericValue = Array.isArray(value) ? value[0] : value;
  return (
    <input
      type="range"
      min={minValue}
      max={maxValue}
      value={numericValue}
      disabled={isDisabled}
      {...props}
      onChange={(event) => onChange?.(Number(event.currentTarget.value))}
      onMouseUp={(event) => onChangeEnd?.(Number(event.currentTarget.value))}
      onTouchEnd={(event) => onChangeEnd?.(Number(event.currentTarget.value))}
      className={`w-full accent-pink-600 disabled:opacity-50 ${props.className ?? ''}`}
    />
  );
}
