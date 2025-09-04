'use server';
import EventFilters from '@/lib/types/FilterType';
import EventsList from './EventsList';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import Event from '@/lib/classes/event/Event';

interface EventListContainerProps {
  filters: EventFilters;
}
export default async function EventListContainer({ filters }: EventListContainerProps) {
  let plainQueriedEvents;
  const { fire } = await getFirestoreFromServer();

  try {
    const queriedEvents = await Event.queryEvents(fire, filters);
    plainQueriedEvents = queriedEvents.map((event) => event.toPlain());
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-auto bg-white pt-4 group-has-[button]:h-[80%] md:overflow-y-scroll">
      <EventsList plainQueriedEvents={plainQueriedEvents} />
    </div>
  );
}
