import EventListCardPresentational from '@/components/events/eventListCard/EventListCardPresentational';
import type { EventDto } from '@/lib/schemas/event/eventDtoSchema';

export default async function EventList({
  events,
  renderActions,
  withDescription = true,
}: {
  events: EventDto[];
  renderActions?: (event: EventDto) => React.ReactNode;
  withDescription?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <EventListCardPresentational
          key={event.id}
          eventId={event.id}
          title={event.title}
          category={event.category}
          description={withDescription ? event.description : undefined}
          ageRestriction={event.ageRestriction}
          startDate={event.startsAt}
          actions={renderActions?.(event)}
        />
      ))}
    </div>
  );
}
