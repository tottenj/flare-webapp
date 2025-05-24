import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import EventFilters from '@/lib/types/FilterType';
import { FirebaseApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { Firestore, orderBy } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import EventCard from '../cards/EventCard/EventCard';
import verifyOrg from '@/lib/firebase/utils/verifyOrg';

interface orgDashboardProps {
  firebase: FirebaseApp;
  currentUser: User;
  fire: Firestore;
}
export default async function OrgDashboard({ firebase, currentUser, fire }: orgDashboardProps) {
  let isOrg = false;
  let org = null;
  try {
    isOrg = await verifyOrg(currentUser);
    org = await FlareOrg.getOrg(fire, currentUser.uid);
  } catch (error) {
    console.log(error);
    redirect('/');
  }
  if (!org || !isOrg) redirect('/');


  const eventFilters: EventFilters = { flare_id: currentUser.uid };
  const events = await Event.queryEvents(fire, eventFilters);

  return (
    <div className="flex">
      <div className="flex w-1/2 flex-col rounded-2xl bg-white p-4">
        <h2>Member Details</h2>
        <div className="flex">
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
      <div className="rounded-2xl bg-white p-4">
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p className="text-gray-500">No events yet. Start by creating one!</p>
        )}
      </div>
    </div>
  );
}
