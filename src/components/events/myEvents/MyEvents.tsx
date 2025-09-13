"use server"
import EventCard from "@/components/cards/EventCard/EventCard";
import SVGLogo from "@/components/flare/svglogo/SVGLogo";
import Event from "@/lib/classes/event/Event";
import { getFirestoreFromServer } from "@/lib/firebase/auth/configs/getFirestoreFromServer";
import { QueryOptions } from "@/lib/firebase/firestore/firestoreOperations";
import EventFilters from "@/lib/types/FilterType";
import { redirect } from "next/navigation";


export default async function MyEvents() {
  const { fire, currentUser } = await getFirestoreFromServer();
  let events: Event[] = [];

  if(!currentUser) redirect("/events")
  try{
    const eventFilters: EventFilters = { flare_id: currentUser.uid };
    const options: QueryOptions = { orderByField: 'createdAt', orderDirection: 'desc' };
    events = await Event.queryEvents(fire, eventFilters, options, true);
  }catch(error){
    console.log(error)
  }

  return (
    <div className="mt-4 flex w-11/12 mr-auto ml-auto flex-col gap-4">
      {events.length > 0 ? (
        events.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 text-center text-[#b3b3b3]">
          <SVGLogo color={'#b3b3b3'} size={45} />
          <p className="mb-2">Your events will appear here. Use the plus button to create one!</p>
        </div>
      )}
    </div>
  );
}
