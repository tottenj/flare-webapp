type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`bg-default-200/70 dark:bg-default-100/20 animate-pulse duration-100 rounded-md ${className}`}
    />
  );
}
