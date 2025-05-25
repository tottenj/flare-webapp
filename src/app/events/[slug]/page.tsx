import Event from "@/lib/classes/event/Event";
import { getFirestoreFromServer } from "@/lib/firebase/auth/configs/getFirestoreFromServer";

export default async function FullEventPage({ params }: { params: { slug: string } }) {
  const {fire} = await getFirestoreFromServer()
  const event = await Event.getEvent(fire, params.slug);
  if (!event) return <p>Event not found</p>;

  return (
    <div className="p-6">
      <h1>{event.title}</h1>
      {/* full view */}
    </div>
  );
}
