"use server"
import EventInfo from '@/components/events/EventInfo';
import Modal from '@/components/modals/mainModal/MainModal';


export default async function EventModalInterception({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Modal isOpen={true} route={true}>
        <EventInfo slug={slug} />
    </Modal>
  );
}
