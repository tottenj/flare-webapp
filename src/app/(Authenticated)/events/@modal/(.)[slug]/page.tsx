'use server';
import EventInfo from '@/components/events/eventInfo/EventInfo';
import EventInfoContainer from '@/components/events/eventInfo/EventInfoContainer';
import Modal from '@/components/modals/mainModal/MainModal';

export default async function EventModalInterception({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Modal isOpen={true} route={true}>
      <EventInfoContainer slug={slug} />
    </Modal>
  );
}
