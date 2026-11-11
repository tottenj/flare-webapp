'use client';

import { useTheme } from 'next-themes';
import { ListBox } from '@heroui/react';
import HeroUISelect from '@/components/ui/HeroUISelect/HeroUISelect';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const roundedClass = 'rounded-sm';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <HeroUISelect
      aria-label="Theme"
      className="w-36 rounded-md"
      variant="secondary"
      value={theme ?? 'system'}
      onChange={(value) => {
        if (value === 'light' || value === 'dark' || value === 'system') setTheme(value);
      }}
    >
      <HeroUISelect.Trigger>
        <HeroUISelect.Value />
        <HeroUISelect.Indicator />
      </HeroUISelect.Trigger>
      <HeroUISelect.Popover className={'rounded-md'}>
        <ListBox className={'rounded-md'}>
          <ListBox.Item className={roundedClass} id="light" textValue="Light">
            Light
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item className={roundedClass} id="dark" textValue="Dark">
            Dark
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item className={roundedClass} id="system" textValue="System">
            System
            <ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </HeroUISelect.Popover>
    </HeroUISelect>
  );
}
