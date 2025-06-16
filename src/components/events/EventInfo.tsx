'use server';
import Event from '@/lib/classes/event/Event';
import Image from 'next/image';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import { getServicesFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import Link from 'next/link';
import BookmarkButton from '../buttons/bookmarkButton/BookmarkButton';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import Modal from '../modals/mainModal/MainModal';

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

  return (
    <>
      <div className="cardInner">
        <div className="bookmarkButton">{currentUser?.uid != event.flare_id && (
        <BookmarkButton slug={slug} seen={hasSeen} event={event.id} />
      )}</div>
        <h1>{event.title}</h1>
        <p>{org?.name ? 'Hosted By ' + org.name : ''}</p>
        
        <div className="mt-4 flex flex-col sm:flex-row h-full w-full gap-8">
          {img && (
            <div className="eventImage">
              <Image
                src={img}
                alt={event.title}
                fill
                className="object-contain object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          )}

          <div className="eventText">
              <p><b>Date:</b> {event.startdate.toDateString()}</p>
              <p><b>Time:</b> {event.startdate.toLocaleTimeString()}</p>
              <p><b>Location:</b> {event.location.name}</p>
              <p><b>Cost:</b> {event.price == 0 ? 'Free' : `$${event.price}`}</p>
              <p><b>Age Group:</b> {event.ageGroup}</p>
              <p className="eventDesc">{event.description}</p>
              {event.ticketLink && <Link className='bg-primary text-white border-2 border-primary text-black text-center w-full hover:bg-white hover:text-primary rounded-2xl p-1 mt-4' href={event.ticketLink}>Purchase Tickets</Link>}
          </div>
        </div>
      </div>

    </>
  );
}
