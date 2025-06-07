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
  const filterCopy = {...filters}
  const queriedEvents = await Event.queryEvents(fire, filters);
  const plainQueriedEvents = queriedEvents.map((event) => event.toPlain());


  // Get all events for the month to display dots
  delete filters.onDate;
  const calendarEvents = await Event.queryEvents(fire, filters);
  const plainMonthsEvents = calendarEvents.map((event) => event.toPlain());

  return (
    <>
      <div className="flex h-full flex-col gap-8 p-4 pt-8 lg:h-11/12 lg:flex-row lg:gap-12">
        <div className="h-auto w-full lg:h-full lg:w-4/5">
          <FullPageCalendar events={plainMonthsEvents} />
        </div>
        <div className="flex h-full w-full flex-col items-center gap-4 overflow-scroll rounded-2xl bg-white p-4 lg:w-2/5">
          <div className="relative mb-4 w-full">
            <FilterModal />
            <h2 className="text-center text-xl font-semibold">Events</h2>
            <hr className="border-primary mt-2 w-full rounded-2xl border-2" />
          </div>
          <div className="w-full">
            {Object.keys(filterCopy).length > 0 && (
            <ClearFiltersButton/>
            )}
            <FilterToggles />
            <div className="flex flex-col gap-4">
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
