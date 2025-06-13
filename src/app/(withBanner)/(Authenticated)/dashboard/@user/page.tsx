'use server';
import EditProfileButton from '@/components/buttons/editProfile/EditProfileButton';
import EventCard from '@/components/cards/EventCard/EventCard';
import EventInfo from '@/components/events/EventInfo';
import GeneralLoader from '@/components/loading/GeneralLoader';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import Event from '@/lib/classes/event/Event';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function UserDashboardPage() {
  const { fire, currentUser } = await getFirestoreFromServer();
  if (!currentUser) redirect('/events');
  const flareU = await FlareUser.getUserById(currentUser?.uid, fire);
  if (!flareU) return null;

  let savedEvents: Event[] = [];
  try {
    savedEvents = await flareU.getAllSavedEvents(fire);
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="flex w-full h-full justify-between gap-4 rounded-2xl p-4 pt-0 lg:flex-row">
      <div className="flex h-full w-1/2 flex-col gap-4 rounded-2xl">
        <div className="rounded-2xl bg-white h-2/5 p-4">
          <h2>Member Details</h2>
          <div className="mt-4 flex flex-col">
            <div className="flex gap-4">
              <div>
                <Suspense fallback={<GeneralLoader />}>
                  <ProfilePicture size={100} />
                </Suspense>
                <EditProfileButton />
              </div>
              <div>
                <p>
                  <b>Name: </b>
                  {flareU.name}
                </p>
                <p>
                  <b>Email: </b>
                  {flareU.email}
                </p>
              </div>
            </div>
          </div>
        </div>
        {}
        <div className="hidden bg-white h-4/5 p-4 rounded-2xl lg:block">
          {savedEvents.length > 0 ? (<EventInfo slug={savedEvents[0].id} />) : (<p>lkdsjfljl</p>)}
        </div>
      </div>

      <div className="relative flex h-full w-full flex-col items-center lg:w-1/2 rounded-2xl bg-white p-4">
        <h2>Saved Events</h2>
        <div className="mt-4 flex w-full flex-col gap-4">
          {savedEvents.length > 0 ? (
            savedEvents.map((event) => <EventCard key={event.id} event={event.toPlain()} />)
          ) : (
            <p className="text-gray-500">No events yet. Start by saving one!</p>
          )}
        </div>
      </div>
    </div>
  );
}
