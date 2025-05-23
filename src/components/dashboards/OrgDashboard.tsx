import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import EventFilters from '@/lib/types/FilterType';
import { FirebaseApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { Firestore, orderBy } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import EventCard from '../cards/EventCard/EventCard';

interface orgDashboardProps {
  firebase: FirebaseApp;
  currentUser: User;
  fire: Firestore;
}
export default async function OrgDashboard({ firebase, currentUser, fire }: orgDashboardProps) {
  const org = await FlareOrg.getOrg(fire, currentUser.uid);
  if (!org) redirect('/');
  const eventFilters: EventFilters = { flare_id: currentUser.uid };
  const events = await Event.queryEvents(fire, eventFilters)

  return (
    <div className='flex'>
      <div className="w-1/2 rounded-2xl bg-white p-4 flex flex-col">
        <h2>Member Details</h2>
        <div className='flex'>
          <p><b>Organization Name: </b>{org.name}</p>
          <p><b>Status: </b>{org.verified ? "Verified" : "Pending"}</p>
        </div>
      </div>
      <div className='bg-white p-4 rounded-2xl'>
        {events.map((event) => (
          <EventCard event={event} />
        ))}
      </div>
    </div>
  );
}
