'use server';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import { redirect } from 'next/navigation';
import MemberDetails from '@/components/organizationDashboard/MemberDetails/MemberDetails';
import isOrganization from '@/lib/utils/authentication/isOrganization';
import EventDetails from '@/components/organizationDashboard/EventDetails/EventDetails';
import EventsListings from '@/components/organizationDashboard/EventsListings/EventsListings';
import ErrorToast from '@/components/errors/ErrorToast';

export default async function OrgDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const { tab } = resolvedSearchParams;
  const { fire } = await getFirestoreFromServer();
  const orgCheck = await isOrganization();
  if (!orgCheck) redirect('/events');
  const { currentUser } = orgCheck;
  const org = await FlareOrg.getOrg(fire, currentUser.uid);
  if (!org) redirect('/events');
  let errors: string | null = null
  let event: Event[] = [];
  try {
    event = await Event.queryEvents(
      fire,
      { flare_id: currentUser.uid },
      { orderByField: 'createdAt', orderDirection: 'desc', limit: 1 },
      true
    );
  } catch (error) {
    errors = "Problem Fetching Events Please Try Again Later"
    console.log(error);
  }

  return (
    <div className="grid h-full grid-cols-1 grid-rows-[1fr_4fr] gap-4 md:grid-cols-2">
      <MemberDetails org={org} />
      <div className="md:col-start-2 md:row-span-2">
        <EventsListings user={org} tab={tab} />
      </div>
      <EventDetails eventId={event[0] ? event[0].id : undefined} />
      {errors && <ErrorToast message={errors}/>}
    </div>
  );
}
