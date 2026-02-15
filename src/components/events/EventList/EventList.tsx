import EventListCardPresentational from '@/components/events/eventListCard/EventListCardPresentational';
import { EventDto } from '@/lib/types/dto/EventDto';

export default async function EventList({ events }: { events: EventDto[] }) {
  return (
    <div className="flex flex-col">
      {events.map((event) => (
        <EventListCardPresentational
          eventId={event.id}
          title={event.title}
          category={event.category}
          description={event.description}
          ageRestriction={event.ageRestriction}
          startDate={event.startsAt}
        />
      ))}
    </div>
  );
}
