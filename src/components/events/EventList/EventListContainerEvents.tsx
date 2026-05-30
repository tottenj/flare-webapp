import EventList from '@/components/events/EventList/presentational/EventList';
import { logger } from '@/lib/logger';
import { EventService } from '@/lib/services/eventService/eventService';
import type { EventDto } from '@/lib/schemas/event/eventDtoSchema';
import { connection } from 'next/server';

export default async function EventListContainerEvents() {
  await connection();
  let events: EventDto[] = [];
  try {
    events = await EventService.listEventsUser();
  } catch (error) {
    logger.error('Error fetching event page events', error);
  }
  return <EventList events={events} withDescription={false} />;
}
