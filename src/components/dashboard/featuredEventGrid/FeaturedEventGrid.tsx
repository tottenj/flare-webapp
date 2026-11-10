import DashboardEventCard, {
  type DashboardEvent,
} from '@/components/dashboard/dashboardEventCard/DashboardEventCard';

export default function FeaturedEventGrid({ events }: { events: DashboardEvent[] }) {
  return (
    <div className="border-separator grid overflow-hidden rounded-md border md:grid-cols-2">
      {events.slice(0, 3).map((event, index) => {
        const featured = index === 0;
        return (
          <div
            key={event.id}
            className={`${index > 0 ? 'border-separator border-t' : ''} ${featured ? 'md:row-span-2' : 'md:border-separator md:border-l'} ${index === 1 ? 'md:border-t-0' : ''}`}
          >
            <DashboardEventCard event={event} featured={featured} />
          </div>
        );
      })}
    </div>
  );
}
