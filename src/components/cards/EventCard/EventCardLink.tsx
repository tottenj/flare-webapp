'use client';

import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { UrlObject } from 'url';
import { ParsedUrlQueryInput } from 'querystring';

type EventCardLinkProps = LinkProps & {
  children: ReactNode;
  back?: boolean;
};

export default function EventCardLink({
  children,
  href,
  back = false,
  ...props
}: EventCardLinkProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

  let resolvedHref: UrlObject;

  if (typeof href === 'string') {
    resolvedHref = {
      pathname: href,
      query: { returnTo: currentPath, back: back ? 'true' : undefined },
    };
  } else {
    // safely merge query only if it's an object
    const existingQuery =
      href.query && typeof href.query === 'object' ? (href.query as ParsedUrlQueryInput) : {};

    resolvedHref = {
      pathname: href.pathname,
      query: {
        ...existingQuery,
        returnTo: currentPath,
        back: back ? 'true' : undefined,
      },
      hash: href.hash,
    };
  }

  return (
    <Link href={resolvedHref} scroll={false}  {...props}>
      {children}
    </Link>
  );
}
