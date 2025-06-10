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
import Tooltip from '@/components/info/toolTip/Tooltip';
import { getClaims } from '@/lib/firebase/utils/getClaims';
import EditModal from '@/components/modals/editModal/EditModal';
import EditOrgForm from '@/components/forms/editOrgForm/EditOrgForm';

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

  const { claims } = await getClaims();
  if (!claims || !claims.organization == true || !currentUser) redirect('/events');

  let org;
  try {
    org = await FlareOrg.getOrg(fire, currentUser.uid);
  } catch (error) {
    redirect('/events');
  }
  if (!org) redirect('/events');

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
    <div className="flex h-full flex-col items-start justify-start gap-4 px-4 lg:flex-row">
      <div className="relative flex h-auto w-full flex-col justify-start gap-4 lg:h-full lg:w-1/2">
        <div className="flex w-full flex-col rounded-2xl bg-white p-4">
          <div className="absolute right-4">
            <EditModal>
              <EditOrgForm org={org.toPlain()} />
            </EditModal>
          </div>
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
                  <b>Email: </b>
                  {org.email}
                </p>
                <div className="flex">
                  <p>
                    <b>Status: </b>
                  </p>
                  <Tooltip text="Your organization is pending verification. You can create events now, but they won’t be visible publicly until your verification is complete. Verification usually takes up to 24 hours. Thanks for your patience!">
                    {org.verified ? 'Verified ' : 'Pending'}
                  </Tooltip>
                </div>
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
        <div className="hidden h-full rounded-2xl bg-white p-4 lg:block">
          {events.length > 0 && <EventInfo slug={events[0].id} />}
        </div>
      </div>

      <div className="relative flex h-full w-full flex-col items-center lg:w-1/2">
        <OrgTabs />
        <div className="z-10 mt-[40px] h-full w-full rounded-2xl bg-white p-4">
          {!tab ||
            (tab === 'myEvents' && (
              <>
                <div className="flex justify-between">
                  <h2>My Events</h2>
                  <AddEventModal />
                </div>

                <div className="mt-4 flex w-full flex-col gap-4">
                  {events.length > 0 ? (
                    events.map((event) => <EventCard key={event.id} event={event.toPlain()} />)
                  ) : (
                    <p className="text-gray-500">No events yet. Start by creating one!</p>
                  )}
                </div>
              </>
            ))}
          {tab && tab === 'savedEvents' && <SavedEvents savedEvents={saved} />}
        </div>
      </div>
    </div>
  );
}
