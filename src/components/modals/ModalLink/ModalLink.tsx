'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

type ModalLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  route: string;
};

export default function ModalLink({ route, children, className = '' }: ModalLinkProps) {
  const pathname = usePathname();
  const params = useSearchParams();

  const search = new URLSearchParams(params.toString());
  const existingReturnTo = search.get('returnTo');

  if (!existingReturnTo) {
    const currentParams = new URLSearchParams(params.toString());
    currentParams.delete('returnTo');
    const currentQuery = currentParams.toString();
    search.set('returnTo', pathname + (currentQuery ? `?${currentQuery}` : ''));
  }

  return (
    <Link
      href={{ pathname: route, query: Object.fromEntries(search) }}
      className={`inline-flex cursor-pointer items-center justify-center ${className}`}
    >
      {children}
    </Link>
  );
}
