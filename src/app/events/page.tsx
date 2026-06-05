import EventCalendar from '@/components/events/EventCalendar/EventCalendar';
import EventList from '@/components/events/EventList/presentational/EventList';
import FilterModalContainer from '@/components/events/filters/FilterModalContainer';
import MainModal from '@/components/modals/MainModal/MainModal';
import { mapUrlFiltersToUserEventFilters } from '@/lib/mappers/mapUrlFiltersToUserEventFilters/mapUrlFiltersToUserEventFilters';
import { EventDto } from '@/lib/schemas/event/eventDtoSchema';
import { UserEventUrlFilter } from '@/lib/schemas/event/userEventUrlFilterSchema';
import { UserEventUrlFilterSchema } from '@/lib/schemas/event/userEventUrlFilterSchema';
import { EventService } from '@/lib/services/eventService/eventService';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connection } from 'next/server';

export default async function page(props: { searchParams?: Promise<UserEventUrlFilter> }) {
  await connection();
  const params = await props.searchParams;

  const parsed = UserEventUrlFilterSchema.safeParse(params ?? {});
  const urlFilters = parsed.success ? parsed.data : UserEventUrlFilterSchema.parse({});
  const filters = mapUrlFiltersToUserEventFilters(urlFilters);

  const filterData = await EventService.getPublicFilterData(urlFilters);

  let events: EventDto[] = [];
  try {
    events = await EventService.listEventsUser(filters);
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  return (
    <div className="flex h-auto w-full flex-col gap-8 md:h-full md:flex-row">
      <div className="w-full md:w-3/5">
        <EventCalendar events={events} />
      </div>
      <div className="relative flex flex-1 flex-col gap-4 rounded-2xl bg-white p-4 shadow-2xl">
        <div className="flex">
          <h2>Events</h2>

          <MainModal
            modalProps={{ size: '4xl' }}
            trigger={
              <button
                data-cy="events-filter-trigger"
                className="absolute right-4 cursor-pointer text-2xl"
              >
                <FontAwesomeIcon icon={faFilter} />
              </button>
            }
          >
            <FilterModalContainer {...filterData} />
          </MainModal>
        </div>

        <EventList events={events} withDescription={false} />
      </div>
    </div>
  );
}
