import EventList from '@/components/events/EventList/EventList';
import { EventService } from '@/lib/services/eventService/eventService';
import { EventDto } from '@/lib/types/dto/EventDto';

export default async function EventListContainerOrg({ orgId }: { orgId: string }) {
  let events: EventDto[] = [];
  try {
    events = await EventService.listEventsOrg(orgId);
  } catch (error) {
    console.log(error)
  }



  return <EventList events={events} />;
}
