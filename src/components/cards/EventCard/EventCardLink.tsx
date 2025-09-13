'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function EventCardLink({
  children,
  href,
  back = false,
}: {
  children: React.ReactNode;
  href: string;
  back?: boolean;
}) {

  return (
    <Link
      href={href}
      scroll={false}
      shallow
      // pass back as query if you want, otherwise leave clean URL
      // returnTo is not included in URL
    >
      {children}
    </Link>
  );
}
