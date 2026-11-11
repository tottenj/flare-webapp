import Link from 'next/link';
import type { ComponentProps } from 'react';

type NavBarLinkProps = Pick<ComponentProps<typeof Link>, 'href' | 'children'>;

export default function NavBarLink({ href, children }: NavBarLinkProps) {
  return (
    <Link className="hover:text-accent transition-all duration-300 ease-in-out" href={href}>
      {children}
    </Link>
  );
}
