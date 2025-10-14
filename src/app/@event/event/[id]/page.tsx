import EventModalClient from '@/components/cards/EventCard/EventModalClient';
import EventInfoContainer from '@/components/events/eventInfo/EventInfoContainer';
import HeroModal from '@/components/modals/Hero/HeroModal/HeroModal';
import Event from '@/lib/classes/event/Event';
import { getFirestoreFromStatic } from '@/lib/firebase/auth/configs/getFirestoreFromServer';

export const revalidate = 60;

export async function generateStaticParams() {
  const fire = await getFirestoreFromStatic();
  const events = await Event.queryEvents(fire, {});
  return events.map((even) => ({ id: even.id }));
}

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string; back?: string }>;
}) {
  const { id } = await params;
  const { returnTo } = await searchParams;

  return (
    <HeroModal returnTo={returnTo}>
      <EventInfoContainer slug={id} />
    </HeroModal>
  );
}
