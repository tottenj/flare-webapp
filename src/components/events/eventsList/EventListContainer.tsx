'use server';
import EventFilters from '@/lib/types/FilterType';
import EventsList from './EventsList';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import Event, { PlainEvent } from '@/lib/classes/event/Event';
import EventCard from '@/components/cards/EventCard/EventCard';
import PrimaryLink from '@/components/Links/PrimaryLink/PrimaryLink';
import Logo from '@/components/flare/logo/Logo';

interface EventListContainerProps {
  filters: EventFilters;
}
export default async function EventListContainer({ filters }: EventListContainerProps) {
  let plainQueriedEvents: PlainEvent[] = [];
  const { fire } = await getFirestoreFromServer();

  try {
    const queriedEvents = await Event.queryEvents(fire, filters);
    plainQueriedEvents = queriedEvents.map((event) => event.toPlain());
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-x-hidden overflow-y-auto bg-white pt-4 group-has-[button]:h-[80%] md:overflow-y-scroll">
      {plainQueriedEvents.length > 0 ? (
        <EventsList>
          {plainQueriedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </EventsList>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 text-center text-[#b3b3b3]">
          <Logo size={100} />
          <p className="text-lg">No events found.</p>
          <p>
            Part of a queer organization? Become a part of the FLARE community and help fill out our
            calendar!
          </p>
          <div className="w-11/12">
            <PrimaryLink link="/flare-signup" linkText="Organization Sign Up" />
          </div>
        </div>
      )}
    </div>
  );
}
