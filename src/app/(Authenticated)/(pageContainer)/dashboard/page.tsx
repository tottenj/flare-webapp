import DashboardShell from '@/components/dashboard/dashboardShell/DashboardShell';
import Skeleton from '@/components/skeletons/BaseSkeleton/BaseSkeleton';
import { Suspense } from 'react';

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ orgId?: string; status?: string }>;
}) {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <DashboardShell searchParams={searchParams} />
    </Suspense>
  );
}
