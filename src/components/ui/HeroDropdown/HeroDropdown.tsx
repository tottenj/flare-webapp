'use client';

import { Dropdown } from '@heroui/react';
import type { ComponentProps } from 'react';

export type HeroDropdownProps = ComponentProps<typeof Dropdown>;

function HeroDropdownRoot(props: HeroDropdownProps) {
  return <Dropdown {...props} />;
}

const HeroDropdown = Object.assign(HeroDropdownRoot, {
  Trigger: Dropdown.Trigger,
  Popover: Dropdown.Popover,
  Menu: Dropdown.Menu,
  Item: Dropdown.Item,
  ItemIndicator: Dropdown.ItemIndicator,
  Section: Dropdown.Section,
  SubmenuTrigger: Dropdown.SubmenuTrigger,
  SubmenuIndicator: Dropdown.SubmenuIndicator,
});

export default HeroDropdown;
