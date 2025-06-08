'use server';
import ClearFiltersButton from '@/components/buttons/clearFiltersButton/ClearFiltersButton';
import FilterToggles from '@/components/buttons/filterToggles/FilterToggles';
import FullPageCalendar from '@/components/calendars/calendar/Calendar';
import EventCard from '@/components/cards/EventCard/EventCard';
import FilterModal from '@/components/modals/filterModal/FilterModal';
import Event from '@/lib/classes/event/Event';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import getEventFiltersFromSearchParams from '@/lib/utils/other/getEventFilters';
import Link from 'next/link';

export default async function EventView({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const { fire } = await getFirestoreFromServer();

  // Get filtered list for selected date/type
  const filters = getEventFiltersFromSearchParams(resolvedSearchParams);
  const filterCopy = { ...filters };
  const queriedEvents = await Event.queryEvents(fire, filters);
  const plainQueriedEvents = queriedEvents.map((event) => event.toPlain());

  // Get all events for the month to display dots
  delete filters.onDate;
  const calendarEvents = await Event.queryEvents(fire, filters);
  const plainMonthsEvents = calendarEvents.map((event) => event.toPlain());

  return (
    <>
      <div className="relative flex h-[calc(100dvh-58px)] max-w-[1440px] m-auto flex-col gap-2 p-2 md:flex-row md:gap-4 md:p-4">
        <div className="h-2/5 w-full md:h-full md:w-3/5">
          <FullPageCalendar events={plainMonthsEvents} />
        </div>

        <div className="relative flex h-3/5 w-full flex-col items-center gap-4 rounded-2xl bg-white p-4 md:h-full md:w-2/5">
          <div className="relative w-full h-[5%]">
            <FilterModal />
            <h2 className="text-center text-xl font-semibold">Upcoming Events</h2>
            {/* <hr className="border-primary mt-2 w-full rounded-2xl border-2" /> */}
          </div>

          <div className="group w-full h-[95%]">
            {Object.keys(filterCopy).length > 0 && <ClearFiltersButton />}
            <FilterToggles />
            <div className="group-has-[button]:h-[80%] flex w-full flex-col gap-2 overflow-x-hidden overflow-y-scroll bg-white h-full">
              {plainQueriedEvents.map((even) => (
                <EventCard key={even.id} event={even} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
