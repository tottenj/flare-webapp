'use server';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import EventFilters from '@/lib/types/FilterType';
import { redirect } from 'next/navigation';
import AddEventModal from '@/components/modals/addEventModal/AddEventModal';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import EditProfileButton from '@/components/buttons/editProfile/EditProfileButton';
import { Suspense } from 'react';
import OrgTabs from '@/components/tabs/orgTabs/OrgTabs';
import SavedEvents from '@/components/events/savedEvents/SavedEvents';
import { QueryOptions } from '@/lib/firebase/firestore/firestoreOperations';
import Tooltip from '@/components/info/toolTip/Tooltip';
import { getClaims } from '@/lib/firebase/utils/getClaims';
import EditModal from '@/components/modals/editModal/EditModal';
import EditOrgForm from '@/components/forms/editOrgForm/EditOrgForm';
import MyEvents from '@/components/events/myEvents/MyEvents';
import EventsListSkeleton from '@/components/skeletons/eventCardSkeleton/EventCardSkeleton';
import ProfilePictureSkeleton from '@/components/skeletons/ProfilePictureSkeleton/ProfilePictureSkeleton';
import EventInfoContainer from '@/components/events/eventInfo/EventInfoContainer';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import PassInModal from '@/components/modals/passInModal/PassInModal';
import DeleteAccountForm from '@/components/forms/deleteAccountForm/DeleteAccountForm';

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

  let saved: Event[] = [];
  let events: Event[] = [];
  try {
    const eventFilters: EventFilters = { flare_id: currentUser.uid };
    const options: QueryOptions = { orderByField: 'createdAt', orderDirection: 'desc', limit: 1 };
    events = await Event.queryEvents(fire, eventFilters, options);
    saved = await org.getAllSavedEvents(fire);
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="flex h-full flex-col items-start justify-start gap-4 px-4 md:flex-row">
      <div className="relative flex h-auto w-full flex-col justify-start gap-4 md:h-full md:w-1/2 lg:w-1/2">
        <div className="flex h-full w-full flex-col rounded-2xl bg-white p-4 md:h-2/5">
          <div className="absolute right-4 flex gap-4">
            <EditModal>
              <EditOrgForm org={org.toPlain()} />
            </EditModal>
            <EditModal icon={faGear}>
              <div className="flex min-h-[500px] flex-col items-center justify-between">
                <h2>Settings</h2>
                <PassInModal
                  trigger={
                    <div className="bg-red w-11/12 rounded-2xl p-2 font-black text-white hover:bg-red-600">
                      Delete Account?
                    </div>
                  }
                >
                 <DeleteAccountForm/>
                </PassInModal>
              </div>
            </EditModal>
          </div>
          <h2>Member Details</h2>
          <div className="mt-4 flex flex-col">
            <div className="flex gap-8">
              <div>
                <Suspense fallback={<ProfilePictureSkeleton size={100} />}>
                  <ProfilePicture size={100} />
                </Suspense>
                <EditProfileButton />
              </div>
              <div>
                <p className="secondaryHeader">
                  <b>Organization Name: </b>
                  {org.name}
                </p>
                <p className="secondaryHeader">
                  <b>Email: </b>
                  {org.email}
                </p>
                <div className="flex">
                  <p className="secondaryHeader">
                    <b>Status: </b>
                  </p>
                  <Tooltip text="Your organization is pending verification. You can create events now, but they won’t be visible publicly until your verification is complete. Verification usually takes up to 24 hours. Thanks for your patience!">
                    <p className="secondaryHeader">{org.verified ? 'Verified ' : 'Pending'}</p>
                  </Tooltip>
                </div>

                <p className="secondaryHeader">
                  <b>Primary Location: </b>
                  {org.location?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden h-4/5 rounded-2xl bg-white md:block">
          {events.length > 0 ? (
            <EventInfoContainer slug={events[0].id} />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-[#b3b3b3]">
              <p className="mb-2">
                Your next upcoming event will appear here. Start by creating one!
              </p>
              <AddEventModal />
            </div>
          )}
        </div>
      </div>

      <div className="relative flex h-full w-full flex-col items-center md:w-1/2">
        <OrgTabs />
        <div className="z-10 mt-[40px] h-full w-full rounded-2xl rounded-t-none bg-white p-4">
          {!tab ||
            (tab === 'myEvents' && (
              <>
                <div className="flex justify-between">
                  <h2>My Events</h2>
                  <AddEventModal />
                </div>
                <Suspense fallback={<EventsListSkeleton />}>
                  <MyEvents />
                </Suspense>
              </>
            ))}
          {tab && tab === 'savedEvents' && (
            <Suspense fallback={<EventsListSkeleton />}>
              <SavedEvents savedEvents={saved} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
