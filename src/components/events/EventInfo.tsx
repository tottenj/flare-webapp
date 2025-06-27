'use server';
import Event from '@/lib/classes/event/Event';
import Image from 'next/image';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import { getServicesFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import SecondaryHeader from '../info/secondaryHeader/SecondaryHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import PrimaryButton from '../buttons/primaryButton/PrimaryButton';
import Link from 'next/link';

export default async function EventInfo({ slug }: { slug: string }) {
  const { firestore, storage, currentUser } = await getServicesFromServer();
  const event = await Event.getEvent(firestore, slug);
  if (!event) return <p>Event not found</p>;
  const org = await FlareOrg.getOrg(firestore, event.flare_id);
  const img = await event.getImage(storage);

  let hasSeen = false;

  if (currentUser) {
    const a = await currentUser?.getIdTokenResult();
    if (a?.claims.organization) {
      const o = await FlareOrg.getOrg(firestore, currentUser.uid);
      if (o) {
        hasSeen = await o.hasSavedEvent(firestore, event.id);
      }
    } else {
      const u = await FlareUser.getUserById(currentUser.uid, firestore);
      if (u) {
        hasSeen = await u.hasSavedEvent(firestore, event.id);
      }
    }
  }

  const formattedDate = event.startdate.toLocaleDateString('en-US', {
    weekday: 'short', // Tue
    month: 'long', // June
    day: 'numeric', // 19
    year: 'numeric', // 2025
  });

  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex h-full flex-row gap-4">
        <div className="relative aspect-[3/5] max-h-[700px] w-full overflow-hidden rounded-xl md:w-1/2 ">
          {img && (
            <Image
              src={img}
              alt="Event Image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 400px, 300px"
              className="object-cover object-top"
            />
          )}
        </div>
        <div className="flex w-1/2 flex-col">
          <h2 className="text-center text-4xl!">{event.title}</h2>
          <p>
            <SecondaryHeader header="Hosted By:" text={org?.name} />
            <div className="mb-8" />
            <SecondaryHeader header={<FontAwesomeIcon icon={faCalendar} />} text={formattedDate} />
            <SecondaryHeader
              header={<FontAwesomeIcon icon={faClock} />}
              text={event.startdate.toLocaleTimeString()}
            />
            <SecondaryHeader
              header={<FontAwesomeIcon icon={faLocationDot} />}
              text={event.location.name}
            />
            <SecondaryHeader
              header={<FontAwesomeIcon icon={faDollarSign} />}
              text={event.price.toString()}
            />
            <SecondaryHeader header={<FontAwesomeIcon icon={faUsers} />} text={event.ageGroup} />

            <p>{event.description}</p>
          </p>
        </div>
      </div>
      {event.ticketLink && (
        <Link
          className="bg-primary font-nunito w-full rounded-2xl p-2 text-center font-black text-white"
          href={event.ticketLink}
        >
          Purchase Ticket
        </Link>
      )}
    </div>
  );
}
