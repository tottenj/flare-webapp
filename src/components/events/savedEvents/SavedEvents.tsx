import EventCard from '@/components/cards/EventCard/EventCard';
import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import LinkInput from '@/components/inputs/link/LinkInput';
import Event from '@/lib/classes/event/Event';

export default async function SavedEvents({ savedEvents }: { savedEvents: Event[] }) {
  return (
    <>
      <h2>Saved Events</h2>
      <div className="mt-4 flex w-full flex-col gap-4">
        {savedEvents.length > 0 ? (
          savedEvents.map((event) => <EventCard key={event.id} event={event.toPlain()} />)
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center gap-4 p-4 text-[#b3b3b3]">
            <SVGLogo color={'#b3b3b3'} size={45} />
            <p className="mb-2">Your saved events will appear here. Get started by clicking the bookmark on an event!</p>
            <LinkInput style={{ padding: '0.5rem' }} href="/" text="View Events" />
          </div>
        )}
      </div>
    </>
  );
}
