"use server"
import Modal from '@/components/modals/mainModal/MainModal';
import EventInfo from '../../../../components/events/EventInfo';

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Modal isOpen={true} route={true}>
      <EventInfo slug={slug} />
    </Modal>
  );
}
