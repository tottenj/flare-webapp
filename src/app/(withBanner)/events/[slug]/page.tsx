
import EventInfo from '@/components/events/EventInfo';
import Event from '@/lib/classes/event/Event';
import { getFirestoreFromServer, getFirestoreFromStatic } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
export const dynamicParams = true;


export async function generateStaticParams() {
  const fire = await getFirestoreFromStatic()
  const events: Event[] = await Event.queryEvents(fire, {});
  return events.map((event) => ({
    slug: String(event.id)
  }))
}
 

export default async function FullEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return <p>Event not found</p>;

  return (
    <>
      <div className="eventPage">
        <EventInfo slug={slug} />
      </div>
    </>
  );
}
