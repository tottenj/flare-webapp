'use client';

import { Select } from '@heroui/react';
import type { ComponentProps } from 'react';

export type HeroUISelectProps = ComponentProps<typeof Select>;

function HeroUISelectRoot(props: HeroUISelectProps) {
  return <Select {...props} />;
}

const HeroUISelect = Object.assign(HeroUISelectRoot, {
  Trigger: Select.Trigger,
  Value: Select.Value,
  Indicator: Select.Indicator,
  ClearButton: Select.ClearButton,
  Popover: Select.Popover,
});

export default HeroUISelect;
