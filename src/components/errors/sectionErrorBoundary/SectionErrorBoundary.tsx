'use client';

import { ErrorBoundary } from 'react-error-boundary';

export function SectionBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
