'use server';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import { redirect } from 'next/navigation';
import MemberDetails from '@/components/organizationDashboard/MemberDetails/MemberDetails';
import isOrganization from '@/lib/utils/authentication/isOrganization';
import EventDetails from '@/components/organizationDashboard/EventDetails/EventDetails';
import EventsListings from '@/components/organizationDashboard/EventsListings/EventsListings';

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

  let event: Event[] = [];
  try {
    event = await Event.queryEvents(
      fire,
      { flare_id: currentUser.uid },
      { orderByField: 'createdAt', orderDirection: 'desc', limit: 1 },
      true
    );
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="flex h-full flex-col items-start justify-start gap-4 px-4 md:flex-row">
      <div className="relative flex h-auto w-full flex-col justify-start gap-4 md:h-full md:w-1/2 lg:w-1/2">
        <MemberDetails org={org} />
        <EventDetails eventId={event[0] ? event[0].id : undefined} />
      </div>
      <EventsListings user={org} tab={tab} />
    </div>
  );
}
