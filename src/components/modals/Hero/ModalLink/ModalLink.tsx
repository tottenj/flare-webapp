'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ModalLink({ children, id, linkTo = "event" }: { children: React.ReactNode, id:string, linkTo?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
  const returnTo = encodeURIComponent(currentUrl);
  const href = id ? `/${linkTo}/${id}?returnTo=${returnTo}` : '/events';
  return <Link href={href}>{children}</Link>;
}
