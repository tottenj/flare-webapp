"use server"
import Event from "@/lib/classes/event/Event";
import FlareOrg from "@/lib/classes/flareOrg/FlareOrg";
import FlareUser from "@/lib/classes/flareUser/FlareUser";
import { getServicesFromServer } from "@/lib/firebase/auth/configs/getFirestoreFromServer";
import EventInfo from "./EventInfo";

export default async function EventInfoContainer({ slug }: { slug: string }) {
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

  return event &&  <EventInfo org={org} img={img} event={event} seen={hasSeen} curUserId={currentUser?.uid}/>;
}