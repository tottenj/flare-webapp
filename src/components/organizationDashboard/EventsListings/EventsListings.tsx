import SquarePlus from '@/components/buttons/squarePlus/SquarePlus';
import MyEvents from '@/components/events/myEvents/MyEvents';
import SavedEvents from '@/components/events/savedEvents/SavedEvents';
import AddEventFormHero from '@/components/forms/addEventForm/AddEventFormHero';
import InjectedModal from '@/components/modals/injectedModal/InjectedModal';
import EventsListSkeleton from '@/components/skeletons/eventCardSkeleton/EventCardSkeleton';
import OrgTabs from '@/components/tabs/orgTabs/OrgTabs';
import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import isOrganization from '@/lib/utils/authentication/isOrganization';
import { Suspense } from 'react';

export default async function EventsListings({
  tab,
  user,
}: {
  tab?: string | string[];
  user: FlareOrg | FlareUser;
}) {
  let saved: Event[] = [];

  const { fire } = await getFirestoreFromServer();
  try {
    saved = await user.getAllSavedEvents(fire);
  } catch (error) {}
  const isOrg = await isOrganization();

  return (
    <div data-cy="eventListing" className="relative flex h-full w-full flex-col items-center">
      {isOrg && <OrgTabs /> }
      <div className={`z-10 ${isOrg && "mt-[40px] rounded-t-none"}  h-full w-full rounded-2xl  bg-white p-4`}>
        {isOrg && (!tab || tab === 'myEvents') && (
          <>
            <div className="flex justify-between">
              <h2>My Events</h2>
              <InjectedModal trigger={<SquarePlus />}>
                <AddEventFormHero />
              </InjectedModal>
            </div>
            <Suspense fallback={<EventsListSkeleton />}>
              <MyEvents />
            </Suspense>
          </>
        )}

        {(tab === 'savedEvents' || !isOrg) && (
          <Suspense fallback={<EventsListSkeleton />}>
            <SavedEvents savedEvents={saved} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
