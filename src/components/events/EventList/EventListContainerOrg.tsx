import EventList from '@/components/events/EventList/presentational/EventList';
import { EventService } from '@/lib/services/eventService/eventService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import { EventDto } from '@/lib/types/dto/EventDto';
import { OrgEventFilter } from '@/lib/types/OrgEventFilter';

export default async function EventListContainerOrg({
  actor,
  filters,
}: {
  actor: AuthenticatedOrganization;
  filters?: OrgEventFilter;
}) {
  let events: EventDto[] = [];
  try {
    events = await EventService.listEventsOrg(actor, filters);
  } catch (error) {
    console.log(error);
  }
  return <EventList events={events} />;
}
