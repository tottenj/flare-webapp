'use server';
import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { getServicesFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import EventInfo from './EventInfo';
import getUser from '@/lib/firebase/auth/getUser';
import getFormattedDateString from '@/lib/utils/dateTime/getFormattedDateString';

export default async function EventInfoContainer({ slug }: { slug: string }) {
  const { firestore, storage, currentUser } = await getServicesFromServer();
  const anyUser = await getUser();
  let hasSeen = false;
  let event;
  let org;

  try {
    event = await Event.getEvent(firestore, slug);
    if (event){ 
      if(anyUser) hasSeen = await anyUser.hasSavedEvent(firestore, event.id)
      org = await FlareOrg.getOrg(firestore, event.flare_id);
    }
  } catch (error) {
    console.log(error);
  }
  if (!event) return <p>Event not found</p>;

  const img = await event.getImage(storage);
  const {formattedDateString, formattedTimeString} = getFormattedDateString(event.startDate)
  




  return (
    <EventInfo orgName={org?.name} img={img} event={event.toPlain()} seen={hasSeen}/>
  );
}
