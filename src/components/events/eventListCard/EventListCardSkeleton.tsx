import Skeleton from '@/components/skeletons/BaseSkeleton/BaseSkeleton';

export default function EventListCardSkeleton() {
  return (
    <div className="border-primary flex w-full gap-4 rounded-2xl border-2 p-4">
      <div className="relative">
        <Skeleton className="h-11.25 w-11.25 rounded-full" />
      </div>

      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
