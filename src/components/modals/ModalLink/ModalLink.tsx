'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ModalLink({
  route,
  children,
}: {
  route: string;
  children: React.ReactNode;
}) {
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
      className="inline-flex cursor-pointer items-center justify-center"
    >
      {children}
    </Link>
  );
}
