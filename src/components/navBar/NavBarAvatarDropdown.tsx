'use client';

import HeroDropdown from '@/components/ui/HeroDropdown/HeroDropdown';
import { signOutUser } from '@/lib/firebase/auth/signOutUser';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faGear, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps, ReactNode } from 'react';

export default function NavBarAvatarDropdown({ children }: { children: ReactNode }) {
  const router = useRouter();

  const links = [
    { label: 'Profile', href: '/dashboard', icon: faUser },
    { label: 'Settings', href: '/settings', icon: faGear },
  ];

  return (
    <HeroDropdown>
      <HeroDropdown.Trigger aria-label="Account menu">{children}</HeroDropdown.Trigger>
      <HeroDropdown.Popover className={'rounded-md'}>
        <div className="grid grid-cols-[auto_1fr] grid-rows-2 gap-x-4 px-3 py-2">
          <div className="row-span-2">{children}</div>
          <p className="font-bold">Your Account</p>
          <p className="text-muted text-xs">Personal Workspace</p>
        </div>
        <HeroDropdown.Menu>
          {links.map(({ label, ...link }) => (
            <NavBarAvatarDropdownLink key={label} {...link}>
              {label}
            </NavBarAvatarDropdownLink>
          ))}
          <HeroDropdown.Item onAction={() => void signOutUser(router)} className="rounded-sm">
            <span className="flex items-center gap-2">
              <span className="inline-flex w-4 shrink-0 justify-center">
                <FontAwesomeIcon icon={faRightFromBracket} aria-hidden="true" />
              </span>
              <span>Sign out</span>
            </span>
          </HeroDropdown.Item>
        </HeroDropdown.Menu>
      </HeroDropdown.Popover>
    </HeroDropdown>
  );
}

type NavBarAvatarDropdownLinkProps = ComponentProps<typeof Link> & { icon?: IconProp };

function NavBarAvatarDropdownLink({
  icon,
  children,
  className,
  ...linkProps
}: NavBarAvatarDropdownLinkProps) {
  return (
    <HeroDropdown.Item className="rounded-sm">
      <Link {...linkProps} className={clsx('flex items-center gap-2', className)}>
        <span className="inline-flex w-4 shrink-0 justify-center">
          {icon && <FontAwesomeIcon icon={icon} aria-hidden="true" />}
        </span>
        <span>{children}</span>
      </Link>
    </HeroDropdown.Item>
  );
}
