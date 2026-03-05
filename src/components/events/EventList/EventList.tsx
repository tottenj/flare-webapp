import EventCardContainer from '@/components/events/EventCard/EventCardContainer';
import EventListCardPresentational from '@/components/events/eventListCard/EventListCardPresentational';
import MainModal from '@/components/modals/MainModal/MainModal';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import { EventDto } from '@/lib/types/dto/EventDto';

export default async function EventList({
  events,
  actor,
}: {
  events: EventDto[];
  actor?: AuthenticatedOrganization;
}) {
  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <MainModal
          key={event.id}
          modalProps={{ size: '5xl' }}
          trigger={
            <EventListCardPresentational
              eventId={event.id}
              title={event.title}
              category={event.category}
              description={event.description}
              ageRestriction={event.ageRestriction}
              startDate={event.startsAt}
            />
          }
        >
          <EventCardContainer eventId={event.id} actor={actor} />
        </MainModal>
      ))}
    </div>
  );
}
