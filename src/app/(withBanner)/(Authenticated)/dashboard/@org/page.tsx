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
import OrgTabs from '@/components/tabs/orgTabs/OrgTabs';
import SavedEvents from '@/components/events/savedEvents/SavedEvents';
import { QueryOptions } from '@/lib/firebase/firestore/firestoreOperations';

export default async function OrgDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const { tab } = resolvedSearchParams;

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
    redirect('/events');
  }
  if (!org || !isOrg) redirect('/events');

  let events: Event[] = [];
  let saved: Event[] = [];
  try {
    const eventFilters: EventFilters = { flare_id: currentUser.uid };
    const options: QueryOptions = { orderByField: 'createdAt', orderDirection: 'desc' };
    events = await Event.queryEvents(fire, eventFilters, options, true);
    saved = await org.getAllSavedEvents(fire);
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="flex flex-col items-start justify-start gap-4 h-full lg:flex-row px-4">
      <div className="relative flex h-auto lg:h-full w-full flex-col justify-start gap-4 lg:w-1/2">
        <div className="flex w-full flex-col h-full lg:h-2/5 rounded-2xl bg-white p-4">
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
        <div className="hidden lg:block h-3/5 rounded-2xl bg-white p-4 overflow-y-scroll">
          {events.length > 0 && <EventInfo slug={events[0].id} />}
        </div>
        
      </div>

      <div className="relative flex w-full h-auto md:h-full flex-col rounded-2xl bg-white items-center lg:w-1/2">
        <OrgTabs />
        <div className="z-10 mt-[40px] w-full h-full p-4 overflow-y-auto">
          {!tab ||
            (tab === 'myEvents' && (
              <>
              <div className="flex justify-between">
                <h2>My Events</h2>
                <AddEventModal />
              </div>
                

                <div className="mt-4 flex w-full h-auto flex-col gap-2 mb-4">
                  {events.length > 0 ? (
                    events.map((event) => <EventCard key={event.id} event={event.toPlain()} />)
                  ) : (
                    <p className="text-gray-500">No events yet. Start by creating one!</p>
                  )}
                </div>
              </>
            ))}
          {tab && tab === 'savedEvents' && saved.length > 0 && <SavedEvents savedEvents={saved} />}
        </div>
      </div>
    </div>
  );
}
