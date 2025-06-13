'use server';
import ClearFiltersButton from '@/components/buttons/clearFiltersButton/ClearFiltersButton';
import FilterToggles from '@/components/buttons/filterToggles/FilterToggles';
import FullPageCalendar from '@/components/calendars/calendar/Calendar';
import EventCard from '@/components/cards/EventCard/EventCard';
import FilterModal from '@/components/modals/filterModal/FilterModal';
import Event from '@/lib/classes/event/Event';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import getEventFiltersFromSearchParams from '@/lib/utils/other/getEventFilters';

export default async function EventView({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const { fire } = await getFirestoreFromServer();

  const filters = getEventFiltersFromSearchParams(resolvedSearchParams);
  const filterCopy = { ...filters };

  let plainQueriedEvents;
  try {
    const queriedEvents = await Event.queryEvents(fire, filters);
    plainQueriedEvents = queriedEvents.map((event) => event.toPlain());
  } catch (error) {
    console.log(error);
  }

  delete filters.onDate;

  let plainMonthsEvents
  try{
  const calendarEvents = await Event.queryEvents(fire, filters);
  plainMonthsEvents = calendarEvents.map((event) => event.toPlain());
  }catch(error){
    console.log(error)
  }

  return (
    <>
      <div className="relative m-auto flex h-auto md:h-[calc(100dvh-58px)] max-w-[1440px] flex-col gap-2 p-2 md:flex-row md:gap-4 md:p-4">
        <div className="h-auto w-full md:h-full md:w-3/5">
          <FullPageCalendar events={plainMonthsEvents || []} />
        </div>

        <div className="relative flex h-auto w-full flex-col items-center gap-4 rounded-2xl bg-white p-2 pt-4 md:p-4 md:h-full md:w-2/5">
          <div className="relative h-[5%] w-full">
            <FilterModal />
            <h2 className="text-center text-xl font-semibold">Upcoming Events</h2>
            {/* <hr className="border-primary mt-2 w-full rounded-2xl border-2" /> */}
          </div>

          <div className="group h-[95%] w-full">
            {Object.keys(filterCopy).length > 0 && <ClearFiltersButton />}
            <FilterToggles />
            <div className="flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-auto md:overflow-y-scroll bg-white group-has-[button]:h-[80%]">
              {plainQueriedEvents && plainQueriedEvents.length > 0 && plainQueriedEvents.map((even) => (
                <EventCard key={even.id} event={even} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
