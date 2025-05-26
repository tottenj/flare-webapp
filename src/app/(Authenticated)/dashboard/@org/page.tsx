"use server"
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import EventFilters from '@/lib/types/FilterType';
import { redirect } from 'next/navigation';
import verifyOrg from '@/lib/firebase/utils/verifyOrg';
import EventCard from '@/components/cards/EventCard/EventCard';
import AddEventModal from '@/components/modals/addEventModal/AddEventModal';

export default async function OrgDashboardPage() {
  const { fire, currentUser, firebaseServerApp } = await getFirestoreFromServer();
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
    <div className="flex justify-center gap-8">
      <div className="flex w-1/3 flex-col rounded-2xl bg-white p-4">
        <h2>Member Details</h2>
        <div className="flex flex-col">
          <p>
            <b>Organization Name: </b>
            {org.name}
          </p>
          <p>
            <b>Status: </b>
            {org.verified ? 'Verified' : 'Pending'}
          </p>
        </div>
      </div>
      <div className="flex w-1/3 flex-col items-center rounded-2xl bg-white p-4">
        <AddEventModal />
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event.id} event={event.toPlain()} />)
        ) : (
          <p className="text-gray-500">No events yet. Start by creating one!</p>
        )}
      </div>
    </div>
  );
}
