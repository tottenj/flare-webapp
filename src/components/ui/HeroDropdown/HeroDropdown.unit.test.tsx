import { render, screen } from '@testing-library/react';
import { Dropdown } from '@heroui/react';
import type { ReactNode } from 'react';
import HeroDropdown from './HeroDropdown';

jest.mock('@heroui/react', () => {
  const Part = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  const Root = ({ children, isOpen }: { children?: ReactNode; isOpen?: boolean }) => (
    <div data-open={isOpen}>{children}</div>
  );

  return {
    Dropdown: Object.assign(Root, {
      Trigger: Part,
      Popover: Part,
      Menu: Part,
      Item: Part,
      ItemIndicator: Part,
      Section: Part,
      SubmenuTrigger: Part,
      SubmenuIndicator: Part,
    }),
  };
});

describe('HeroDropdown', () => {
  it('forwards root props and exposes HeroUI compound components', () => {
    render(
      <HeroDropdown isOpen>
        <HeroDropdown.Trigger>Actions</HeroDropdown.Trigger>
        <HeroDropdown.Popover>
          <HeroDropdown.Menu>
            <HeroDropdown.Item>Edit</HeroDropdown.Item>
          </HeroDropdown.Menu>
        </HeroDropdown.Popover>
      </HeroDropdown>
    );

    expect(screen.getByText('Actions').parentElement).toHaveAttribute('data-open', 'true');
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(HeroDropdown.Trigger).toBe(Dropdown.Trigger);
    expect(HeroDropdown.Popover).toBe(Dropdown.Popover);
    expect(HeroDropdown.Menu).toBe(Dropdown.Menu);
    expect(HeroDropdown.Item).toBe(Dropdown.Item);
    expect(HeroDropdown.ItemIndicator).toBe(Dropdown.ItemIndicator);
    expect(HeroDropdown.Section).toBe(Dropdown.Section);
    expect(HeroDropdown.SubmenuTrigger).toBe(Dropdown.SubmenuTrigger);
    expect(HeroDropdown.SubmenuIndicator).toBe(Dropdown.SubmenuIndicator);
  });
});
