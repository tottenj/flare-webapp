'use server';
import EventModalInterception from '@/app/(Authenticated)/events/@modal/(.)[slug]/page';
import EventInfo from '@/components/events/eventInfo/EventInfo';
import Modal from '@/components/modals/mainModal/MainModal';

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  return <EventModalInterception params={params} />;
}
