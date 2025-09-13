import EventModalClient from '@/components/cards/EventCard/EventModalClient';
import EventInfoContainer from '@/components/events/eventInfo/EventInfoContainer';
import Modal from '@/components/modals/mainModal/MainModal';

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string; back?: string }>;
}) {
  const { id } = await params;
 
  

  return <EventModalClient eventId={id} />;
}
