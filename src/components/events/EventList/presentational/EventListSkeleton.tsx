import EventListCardSkeleton from '@/components/events/eventListCard/EventListCardSkeleton';

export default function EventListSkeleton({numEvents = 5}: {numEvents?: number}) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: numEvents }).map((_, i) => (
        <EventListCardSkeleton key={i} />
      ))}
    </div>
  );
}
