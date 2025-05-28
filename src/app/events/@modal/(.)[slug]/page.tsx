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

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { firestore, storage } = await getServicesFromServer();
  const { slug } = await params;
  const event = await Event.getEvent(firestore, slug);
  if (!event) return <p>Event not found</p>;
  const org = await FlareOrg.getOrg(firestore, event.flare_id);
  const img = await event.getImage(storage);

  return (
    <Modal isOpen={true} route={true}>
      <div className="flex w-full flex-col items-center h-auto">
        <h1>{event.title}</h1>
        <p>{org?.name ? 'Hosted By ' + org.name : ''}</p>
        <div className="mt-4 flex w-full gap-8">
          {img && (
            <div className="relative h-auto min-h-[400px] w-full overflow-hidden rounded-xl shadow-md md:w-1/2">
              <Image
                src={img}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          )}
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-2 text-lg">
              <p>
                <b>Date:</b> {event.startdate.toDateString()}
              </p>
              <p>
                <b>Time:</b> {event.startdate.toLocaleTimeString()}
              </p>
              <p>
                <b>Location:</b> {event.location.name}
              </p>
              <p>
                <b>Cost:</b> {event.price == 0 ? 'Free' : event.price}
              </p>
              <p className="mt-4">{event.description}</p>
            </div>
            {event.ticketLink && <Link href={event.ticketLink}>Purchase Tickets</Link>}
          </div>
        </div>
      </div>
    </Modal>
  );
}
