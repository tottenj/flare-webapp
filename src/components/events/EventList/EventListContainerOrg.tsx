import EventList from '@/components/events/EventList/EventList';
import { EventService } from '@/lib/services/eventService/eventService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import { EventDto } from '@/lib/types/dto/EventDto';

export default async function EventListContainerOrg({ actor }: { actor: AuthenticatedOrganization }) {
  let events: EventDto[] = [];
  try {
    events = await EventService.listEventsOrg(actor);
  } catch (error) {
    console.log(error)
  }
  return <EventList events={events} />;
}
