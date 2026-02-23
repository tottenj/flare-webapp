import EventList from '@/components/events/EventList/EventList';
import { logger } from '@/lib/logger';
import { EventService } from '@/lib/services/eventService/eventService';
import { EventDto } from '@/lib/types/dto/EventDto';

export default async function EventListContainerEvents() {
  let events: EventDto[] = [];
  try {
    events = await EventService.listEventsUser();
  } catch (error) {
    logger.error('Error fetching event page evetns', error);
  }
  return <EventList events={events} />;
}
