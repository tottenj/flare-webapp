'use server';
import EditProfileButton from '@/components/buttons/editProfile/EditProfileButton';
import EventCard from '@/components/cards/EventCard/EventCard';
import EventInfo from '@/components/events/eventInfo/EventInfo';
import EventInfoContainer from '@/components/events/eventInfo/EventInfoContainer';
import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import LinkInput from '@/components/inputs/link/LinkInput';
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
    <div className="flex h-full w-full flex-col justify-between gap-4 rounded-2xl p-4 pt-0 md:flex-row">
      <div className="flex h-full w-full flex-col gap-4 rounded-2xl md:w-1/2">
        <div className="h-full rounded-2xl bg-white p-4 md:h-2/5">
          <h2>Member Details</h2>
          <div className="mt-2 flex h-full flex-col">
            <div className="flex h-full gap-4">
              <div>
                <Suspense fallback={<GeneralLoader size="85" />}>
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
        <div className="hidden h-3/5 rounded-2xl bg-white md:block">
          {savedEvents.length > 0 ? (
            <EventInfoContainer slug={savedEvents[0].id} />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 text-center text-[#b3b3b3]">
              <SVGLogo color={'#b3b3b3'} size={45} />
              <p className="mb-2">
                Your next upcoming event will appear here. Get started by saving an event!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex h-full w-full flex-col items-center rounded-2xl bg-white p-4 md:w-1/2">
        <h2>Saved Events</h2>
        <div className="mt-4 flex w-full flex-col gap-4">
          {savedEvents.length > 0 ? (
            savedEvents.map((event) => <EventCard key={event.id} event={event.toPlain()} />)
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 text-center text-[#b3b3b3]">
              <SVGLogo color={'#b3b3b3'} size={45} />
              <p className="mb-2">
                Your saved events will appear here. Get started by clicking the bookmark on an
                event!
              </p>
              <LinkInput style={{ padding: '0.5rem' }} href="/" text="View Events" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
