'use server';
import MainBanner from '@/components/banners/mainBanner/MainBanner';
import FullPageCalendar from '@/components/calendars/calendar/Calendar';
import EventCard from '@/components/cards/EventCard/EventCard';
import Event from '@/lib/classes/event/Event';
import eventType from '@/lib/enums/eventType';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import EventFilters from '@/lib/types/FilterType';
import getMonthRangeFromDate from '@/lib/utils/other/getMonthRangeFromDate';
import parseEventTypes from '@/lib/utils/other/parseEventTypes';

function searchParamDate(dateParam: string | string[] | undefined) {
  const dateStr = Array.isArray(dateParam) ? dateParam[0] : dateParam;
  const date = dateStr ? new Date(dateStr) : null;
  date?.setDate(date.getDate() + 1);
  return date;
}

export default async function EventView({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let filters: EventFilters = {};
  const { fire } = await getFirestoreFromServer();

  const dateParam = searchParamDate((await searchParams).date);
  const typeParam = parseEventTypes((await searchParams).type?.toString());
  if (typeParam && typeParam.length > 0) {
    filters.type = typeParam as eventType[];
  }

  if (dateParam) {
    dateParam.setDate(dateParam.getDate() - 1);
    filters.onDate = dateParam;
  }

  const queriedEvents = await Event.queryEvents(fire, filters);
  const plainQueriedEvents = queriedEvents.map((event) => event.toPlain());

  if (dateParam) {
    const { startOfMonth, endOfMonth } = getMonthRangeFromDate(dateParam);
    filters.afterDate = startOfMonth;
    filters.beforeDate = endOfMonth;
  }

  delete filters.onDate;
  delete filters.afterDate;
  delete filters.beforeDate;
  const monthsEvents = await Event.queryEvents(fire, filters);
  const plainMonthsEvents = monthsEvents.map((event) => event.toPlain());

  return (
    <>
      <MainBanner />
      <div className="flex flex-col sm:flex-row h-9/10 gap-2 sm:gap-4 p-2 sm:p-4 sm:pt-8">
        <div className="w-full h-3/5 sm:w-4/5 sm:h-full">
          <FullPageCalendar events={plainMonthsEvents} />
        </div>
        <div className="flex w-full h-2/5 sm:h-full sm:w-2/5 bg-white rounded-[20px] flex-col gap-4 overflow-y-auto overflow-x-hidden">
          <h2 className="p-2 sm:p-4 text-base sm:text-lg text-center">Upcoming Events</h2>
          {plainQueriedEvents.map((even) => (
            <EventCard key={even.id} event={even} />
          ))}
        </div>
      </div>
    </>
  );
}
