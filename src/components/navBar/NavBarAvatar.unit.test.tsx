import { expect } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/jest-globals';
import type { ComponentProps, ReactNode } from 'react';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { signOutUser } from '@/lib/firebase/auth/signOutUser';
import NavBarAvatar from './NavBarAvatar';

jest.mock('@/lib/services/userContextService/userContextService', () => ({
  UserContextService: { requireNone: jest.fn() },
}));

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: { getDownloadUrl: jest.fn() },
}));

jest.mock('@/lib/firebase/auth/signOutUser', () => ({ signOutUser: jest.fn() }));
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

jest.mock('@heroui/react', () => {
  const Part = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  const Trigger = (props: ComponentProps<'button'>) => <button {...props} />;
  const Menu = ({ children }: { children?: ReactNode }) => <div role="menu">{children}</div>;
  const Item = ({ children, onAction }: { children?: ReactNode; onAction?: () => void }) => (
    <div role="menuitem" onClick={onAction}>
      {children}
    </div>
  );

  return {
    Avatar: Object.assign(Part, { Image: 'img', Fallback: Part }),
    Dropdown: Object.assign(Part, { Trigger, Popover: Part, Menu, Item }),
  };
});

describe('NavBarAvatar', () => {
  it('renders the signed-in avatar inside the account trigger', async () => {
    jest.mocked(UserContextService.requireNone).mockResolvedValue({
      user: { email: 'jane.doe@example.com', profilePic: null },
    } as Awaited<ReturnType<typeof UserContextService.requireNone>>);

    render(await NavBarAvatar());

    expect(screen.getByRole('button', { name: 'Account menu' })).toHaveTextContent('JD');
    expect(screen.getByText('Your Account')).not.toHaveAttribute('aria-disabled');
    expect(screen.getByRole('menu')).not.toContainElement(screen.getByText('Your Account'));
    expect(screen.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings');
    expect(screen.getByRole('link', { name: 'Profile' }).querySelector('svg')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
    for (const label of ['Profile', 'Settings', 'Sign out']) {
      const row = screen.getByText(label).parentElement;
      expect(row).toHaveClass('flex', 'items-center', 'gap-2');
      expect(row?.querySelector('svg')?.parentElement).toHaveClass('w-4', 'shrink-0');
    }
    fireEvent.click(screen.getByText('Sign out'));
    expect(signOutUser).toHaveBeenCalledWith(
      expect.objectContaining({ push: expect.any(Function), refresh: expect.any(Function) })
    );
  });

  it('renders the anonymous avatar without a dropdown', async () => {
    jest.mocked(UserContextService.requireNone).mockResolvedValue(null);

    render(await NavBarAvatar());

    expect(screen.queryByRole('button', { name: 'Account menu' })).not.toBeInTheDocument();
  });
});
