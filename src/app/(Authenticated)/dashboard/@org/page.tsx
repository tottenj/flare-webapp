'use server';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import EventFilters from '@/lib/types/FilterType';
import { redirect } from 'next/navigation';
import verifyOrg from '@/lib/firebase/utils/verifyOrg';
import EventCard from '@/components/cards/EventCard/EventCard';
import AddEventModal from '@/components/modals/addEventModal/AddEventModal';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import EditProfileButton from '@/components/buttons/editProfile/EditProfileButton';
import { Suspense } from 'react';
import GeneralLoader from '@/components/loading/GeneralLoader';
import EventInfo from '@/components/events/EventInfo';

export default async function OrgDashboardPage() {
  const { fire, currentUser } = await getFirestoreFromServer();
  if (!currentUser) return null;

  let isOrg = false;
  let org = null;

  
  try {
    const { claims } = await verifyOrg(currentUser);
    isOrg = claims;
    org = await FlareOrg.getOrg(fire, currentUser.uid);
  } catch (error) {
    console.log(error);
    redirect('/');
  }
  if (!org || !isOrg) redirect('/');

  const eventFilters: EventFilters = { flare_id: currentUser.uid };
  const events = await Event.queryEvents(fire, eventFilters);

  return (
    <div className="flex flex-col items-start justify-center gap-8 lg:flex-row">
      <div className="flex w-full flex-col justify-between gap-8 lg:w-1/2">
        <div className="flex w-full flex-col rounded-2xl bg-white p-4">
          <h2>Member Details</h2>
          <div className="mt-4 flex flex-col">
            <div className="flex gap-8">
              <div>
                <Suspense fallback={<GeneralLoader />}>
                  <ProfilePicture size={100} />
                </Suspense>
                <EditProfileButton />
              </div>
              <div>
                <p>
                  <b>Organization Name: </b>
                  {org.name}
                </p>
                <p>
                  <b>Status: </b>
                  {org.verified ? 'Verified' : 'Pending'}
                </p>
                <p>
                  <b>Bio: </b>
                  {org.description}
                </p>
                <p>
                  <b>Primary Location: </b>
                  {org.location?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
        {events.length > 0 && <EventInfo slug={events[0].id} />}
      </div>
      <div className="flex w-full flex-col items-center rounded-2xl bg-white p-4 lg:min-h-[800px] lg:w-1/2">
        <h2>My Events</h2>
        <AddEventModal />
        <div className="mt-4 flex w-full flex-col gap-4">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event.toPlain()} />)
          ) : (
            <p className="text-gray-500">No events yet. Start by creating one!</p>
          )}
        </div>
      </div>
    </div>
  );
}
