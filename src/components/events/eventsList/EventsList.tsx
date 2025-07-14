import EventCard from '@/components/cards/EventCard/EventCard';
import LinkInput from '@/components/inputs/link/LinkInput';
import Event, { PlainEvent } from '@/lib/classes/event/Event';


interface eventsList {
  plainQueriedEvents?: PlainEvent[];
}
export default async function EventsList({ plainQueriedEvents }: eventsList) {
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
