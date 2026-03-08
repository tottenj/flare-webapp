import Skeleton from "@/components/skeletons/BaseSkeleton/BaseSkeleton";


export default function EventCardSkeleton() {
  return (
    <div className="@container">
      <div className="grid gap-6 rounded-2xl p-4 pt-2 pb-2 @md:grid-cols-[2.5fr_3fr] @lg:grid-rows-[auto_auto]">
        {/* Image */}
        <Skeleton className="mx-auto aspect-[2/3] w-full max-w-[70cqw] @md:max-w-[100cqw]" />

        {/* Content */}
        <div className="flex flex-col gap-6 pt-2">
          {/* Title */}
          <div className="flex flex-col items-center gap-2 @xl:items-start">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-32" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>

          {/* Metadata */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />

            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-[90%]" />
              <Skeleton className="h-3 w-[75%]" />
              <Skeleton className="h-3 w-[60%]" />
            </div>
          </div>

          {/* Button */}
          <div className="mt-auto flex justify-center">
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
