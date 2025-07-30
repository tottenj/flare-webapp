
export default function EventsListSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg bg-tertiary p-4 h-20" />
      ))}
    </div>
  );
}
