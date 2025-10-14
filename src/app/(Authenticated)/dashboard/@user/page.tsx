'use server';
import EditProfileButton from '@/components/buttons/editProfile/EditProfileButton';
import EventCard from '@/components/cards/EventCard/EventCard';
import EventInfoContainer from '@/components/events/eventInfo/EventInfoContainer';
import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import EditUserForm from '@/components/forms/editUserForm/EditUserForm';
import LinkInput from '@/components/inputs/link/LinkInput';
import GeneralLoader from '@/components/loading/GeneralLoader';
import InjectedModal from '@/components/modals/injectedModal/InjectedModal';
import EventDetails from '@/components/organizationDashboard/EventDetails/EventDetails';
import EventsListings from '@/components/organizationDashboard/EventsListings/EventsListings';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import UserDetails from '@/components/userDashboard/userDetails/UserDetails';
import Event from '@/lib/classes/event/Event';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  <div className="grid h-full grid-cols-1 grid-rows-[1fr_4fr] gap-4 md:grid-cols-2">
    <UserDetails user={flareU} />
    <div className='md:col-start-2 md:row-span-2'>
      <EventsListings user={flareU} />
    </div>
    <EventDetails eventId={savedEvents[0] ? savedEvents[0].id : undefined} />
  </div>
  )
}
