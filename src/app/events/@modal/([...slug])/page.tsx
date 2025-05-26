"use server"
import Modal from '@/components/modals/mainModal/MainModal';
import Event from '@/lib/classes/event/Event';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';


export default async function EventModal({ params }: { params: { slug: string[] } }) {
  const slug = params.slug?.[0]; // because it's a catch-all
  const {fire} = await getFirestoreFromServer()
  const event = await Event.getEvent(fire, slug);

  if (!event) return null;

  return (
    <Modal isOpen={true} route={true} onClose={() => {}}>
      <div></div>
    </Modal>
  );
}
