'use client';

import { Label, ProgressBar } from '@heroui/react';
import type { ComponentProps, ReactNode } from 'react';

export type HeroProgressBarProps = ComponentProps<typeof ProgressBar> & {
  label?: ReactNode;
  showValue?: boolean;
};

function HeroProgressBarRoot({
  label,
  showValue = false,
  children,
  isIndeterminate,
  ...props
}: HeroProgressBarProps) {
  return (
    <ProgressBar isIndeterminate={isIndeterminate} {...props}>
      {children ?? (
        <>
          {label != null && <Label>{label}</Label>}
          {showValue && !isIndeterminate && <ProgressBar.Output />}
          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </>
      )}
    </ProgressBar>
  );
}

const HeroProgressBar = Object.assign(HeroProgressBarRoot, {
  Output: ProgressBar.Output,
  Track: ProgressBar.Track,
  Fill: ProgressBar.Fill,
});

export default HeroProgressBar;
