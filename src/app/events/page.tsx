import EventCalendar from '@/components/events/EventCalendar/EventCalendar';
import EventList from '@/components/events/EventList/presentational/EventList';
import { EventDto } from '@/lib/schemas/event/eventDtoSchema';
import { EventService } from '@/lib/services/eventService/eventService';
import { connection } from 'next/server';

export default async function page() {
  await connection();
  let events: EventDto[] = [];
  try {
    events = await EventService.listEventsUser();
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  return (
    <div className="flex h-auto w-full flex-col gap-8 md:h-full md:flex-row">
      <div className="w-full md:w-3/5">
        <EventCalendar events={events} />
      </div>
      <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-white p-4 shadow-2xl">
        <h2>Events</h2>
        <EventList events={events} withDescription={false} />
      </div>
    </div>
  );
}
