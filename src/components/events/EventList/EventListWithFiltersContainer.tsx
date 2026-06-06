import EventCalendar from '@/components/events/EventCalendar/EventCalendar';
import EventListWithFilters from '@/components/events/EventList/EventListWithFilters';
import EventList from '@/components/events/EventList/presentational/EventList';
import { EventDto } from '@/lib/schemas/event/eventDtoSchema';
import { EventService } from '@/lib/services/eventService/eventService';
import { EventFilterDataDto } from '@/lib/types/dto/event/EventFilterDataDto';
import { UserEventFilter } from '@/lib/types/UserEventFilter';
import { cacheLife, cacheTag } from 'next/cache';

export default async function EventListWithFiltersContainer({
  filters,
}: {
  filters: UserEventFilter;
}) {

  "use cache"
  cacheLife('minutes');
  cacheTag('public-events');


  let events: EventDto[] = [];
  let filterData: EventFilterDataDto = {};
  try {
    [filterData, events] = await Promise.all([
      EventService.getPublicFilterData({ placeId: filters.placeId }),
      EventService.listEventsUser(filters),
    ]);
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  return (
    <div className="flex h-auto w-full flex-col gap-8 md:h-full md:flex-row">
      <div className="w-full md:w-3/5">
        <EventCalendar events={events} />
      </div>
      <EventListWithFilters filterData={filterData}>
        <EventList events={events} withDescription={false} />
      </EventListWithFilters>
    </div>
  );
}
