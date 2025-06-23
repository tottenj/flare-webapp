import EventCard from '@/components/cards/EventCard/EventCard';
import LinkInput from '@/components/inputs/link/LinkInput';
import Event from '@/lib/classes/event/Event';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import EventFilters from '@/lib/types/FilterType';
import fakeLoading from '@/lib/utils/other/fakeLoading';

interface eventsList {
  filters: EventFilters;
  wait?: boolean;
}
export default async function EventsList({ filters, wait = false }: eventsList) {
  let plainQueriedEvents;
  const { fire } = await getFirestoreFromServer();

  if (wait) {
    await fakeLoading(4000);
  }

  try {
    const queriedEvents = await Event.queryEvents(fire, filters);
    plainQueriedEvents = queriedEvents.map((event) => event.toPlain());
  } catch (error) {
    console.log(error);
  }



  return (
    <>
      {plainQueriedEvents && plainQueriedEvents.length > 0 ? (
        plainQueriedEvents.map((even) => <EventCard key={even.id} event={even} />)
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-[#b3b3b3]">
          <p className="mb-2 text-lg">No events found.</p>
          <p className="mb-2">
            Part of a queer organization? Become a part of the FLARE community and help fill out our
            calendar!
          </p>
          <LinkInput
            style={{ padding: '0.5rem' }}
            href="/flare-signin"
            text="Organization Signup"
          />
        </div>
      )}
    </>
  );
}
