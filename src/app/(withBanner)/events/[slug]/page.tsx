'use server';
import EventInfo from '@/components/events/EventInfo';
import Event from '@/lib/classes/event/Event';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
export const dynamicParams = true;


export async function generateStaticParams() {
  const {fire} = await getFirestoreFromServer()
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
      <div className="mt-[-4rem] flex h-dvh items-center justify-center">
        <EventInfo slug={slug} />
      </div>
    </>
  );
}
