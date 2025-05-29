import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import Modal from '@/components/modals/mainModal/MainModal';
import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import {
  getFirestoreFromServer,
  getServicesFromServer,
} from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import Image from 'next/image';
import Link from 'next/link';
import EventInfo from '../../../../components/events/EventInfo';

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { firestore, storage } = await getServicesFromServer();
  const { slug } = await params;
  const event = await Event.getEvent(firestore, slug);
  if (!event) return <p>Event not found</p>;
  const org = await FlareOrg.getOrg(firestore, event.flare_id);
  const img = await event.getImage(storage);

  return (
    <Modal isOpen={true} route={true}>
      <EventInfo />
    </Modal>
  );
}
