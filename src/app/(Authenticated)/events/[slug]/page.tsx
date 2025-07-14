import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import EventInfo from '@/components/events/eventInfo/EventInfo';
import EventInfoContainer from '@/components/events/eventInfo/EventInfoContainer';
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
      <div className="ml-4 flex w-1/5 items-center justify-center">
        <Link
          className="bg-primary hover:text-primary mt-2 block w-full rounded-2xl p-2 text-center font-bold text-white hover:bg-white"
          href={'/events'}
        >
          Events
        </Link>
      </div>
      <div className="eventPage">
        <EventInfoContainer slug={slug} />
      </div>
    </div>
  );
}
