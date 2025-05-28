'use server';
import MainBanner from '@/components/banners/mainBanner/MainBanner';
import FullPageCalendar from '@/components/calendars/calendar/Calendar';
import EventCard from '@/components/cards/EventCard/EventCard';
import Event from '@/lib/classes/event/Event';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import EventFilters from '@/lib/types/FilterType';


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
  const filters: EventFilters = {};
  const dateParam = searchParamDate((await searchParams).date);
  const { fire } = await getFirestoreFromServer();

  if (dateParam) {
    filters.onDate = dateParam;
  }

  const eventTwo = await Event.queryEvents(fire, filters);
  const plainEventTwo = eventTwo.map((event) => event.toPlain());


  return (
    <>
      <MainBanner />
      <div className="flex h-screen gap-12 p-4 pt-8">
        <div className="w-3/5">
          <FullPageCalendar events={plainEventTwo} />
        </div>
        <div className="flex h-[700] w-2/5 flex-col gap-4 overflow-scroll">
          {plainEventTwo.map((even) => (
            <EventCard key={even.id} event={even} />
          ))}
        </div>
      </div>
    </>
  );
}
