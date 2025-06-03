'use server';
import EventCard from '@/components/cards/EventCard/EventCard';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';

export default async function UserDashboardPage() {
  const { fire, currentUser} = await getFirestoreFromServer();
  if (!currentUser) return null;
  const flareU = await FlareUser.getUserById(currentUser?.uid, fire)
  if(!flareU) return null

  const savedEvents = await flareU.getAllSavedEvents(fire)

  return (
    <div className="flex w-full flex-col items-center rounded-2xl bg-white p-4 lg:min-h-[800px] lg:w-1/2">
      <h2>Saved Events</h2>
      <div className="mt-4 flex w-full flex-col gap-4">
        {savedEvents.length > 0 ? (
          savedEvents.map((event) => <EventCard key={event.id} event={event.toPlain()} />)
        ) : (
          <p className="text-gray-500">No events yet. Start by creating one!</p>
        )}
      </div>
    </div>
  );
}