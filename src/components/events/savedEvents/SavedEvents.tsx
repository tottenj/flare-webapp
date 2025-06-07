import EventCard from '@/components/cards/EventCard/EventCard';
import Event from '@/lib/classes/event/Event';

export default async function SavedEvents({ savedEvents }: { savedEvents: Event[] }) {
  return (
    <>
      <h2>Saved Events</h2>
      <div className="mt-4 flex w-full flex-col gap-4">
        {savedEvents.length > 0 ? (
          savedEvents.map((event) => <EventCard key={event.id} event={event.toPlain()} />)
        ) : (
          <p className="text-gray-500">No events yet. Start by saving one!</p>
        )}
      </div>
    </>
  );
}
