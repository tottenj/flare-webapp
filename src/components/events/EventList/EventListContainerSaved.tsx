import SaveEventButtonContainer from '@/components/buttons/saveEventButton/SaveEventButtonContainer';
import EventList from '@/components/events/EventList/presentational/EventList';
import type { EventDto } from '@/lib/schemas/event/eventDtoSchema';
import { EventService } from '@/lib/services/eventService/eventService';
import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';

export default async function EventListContainerSaved({ actor }: { actor: AuthenticatedUser }) {
  let events: EventDto[] = [];
  try {
    events = await EventService.listSavedEvents(actor);
  } catch (error) {
    console.error('Failed to fetch saved events', error);
  }

  if (events.length === 0) {
    return (
      <p className="text-foreground-400 py-4 text-center text-sm">
        No saved events yet. Browse events and bookmark the ones you&apos;re interested in.
      </p>
    );
  }

  return (
    <EventList
      events={events}
      renderActions={(event) => <SaveEventButtonContainer eventId={event.id} initialSaved={true} />}
    />
  );
}
