import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import EventInfo from '@/components/events/EventInfo';
import Event from '@/lib/classes/event/Event';
import {
  getFirestoreFromServer,
  getFirestoreFromStatic,
} from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import Link from 'next/link';
export const dynamicParams = true;

export async function generateStaticParams() {
  const fire = await getFirestoreFromStatic();
  const events: Event[] = await Event.queryEvents(fire, {});
  return events.map((event) => ({
    slug: String(event.id),
  }));
}

export default async function FullEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return <p>Event not found</p>;

  return (
    <div>
      <div className='w-1/5 ml-4 flex justify-center items-center'>
        <Link className='bg-primary w-full hover:bg-white hover:text-primary text-white p-2 rounded-2xl block text-center font-bold mt-2' href={"/events"}>Events</Link>
      </div>
      <div className="eventPage">
        <EventInfo slug={slug} />
      </div>
    </div>
  );
}
