import OrgDashboardInfoPresentational from '@/components/dashboard/orgDashboard/orgDashboardInfo/OrgDashboardInfoPresentational';
import EventCardOrgRecentContainer from '@/components/events/EventCard/EventCardOrgUpcomingContainer';
import EventListContainerOrg from '@/components/events/EventList/EventListContainerOrg';
import CreateEventModalWrapper from '@/components/wrappers/CreateEventModalWrapper';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import { Suspense } from 'react';

export default async function OrgDashboardShell() {
  const ctx = await UserContextService.requireOrg();
  const actor: AuthenticatedOrganization = {
    orgId: ctx.profile.orgProfile.id,
    userId: ctx.user.id,
    firebaseUid: ctx.user.firebaseUid
  }
  return (
    <div className="grid h-full w-full grid-cols-1 grid-rows-[1fr_3fr] gap-4 md:grid-cols-2">
      <OrgDashboardInfoPresentational
        profilePicPath={ctx.user.profilePic}
        orgName={ctx.profile.orgProfile!.orgName}
        email={ctx.user.email}
        status={ctx.profile.orgProfile!.status}
      />
      <div data-cy="my-events-container" className="row-span-2 h-full w-full rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4">
          <h2>My Events</h2>
          <CreateEventModalWrapper orgName={ctx.profile.orgProfile.orgName} />
        </div>
        <Suspense>
          <EventListContainerOrg actor={actor} />
        </Suspense>
      </div>
      <div data-cy="upcoming-container" className="flex h-full w-full flex-col rounded-2xl bg-white pt-4 pb-4">
        <h2 className="pb-8 text-center">Next Upcoming Event</h2>
        <Suspense>
          <EventCardOrgRecentContainer
            orgId={ctx.profile.orgProfile.id}
            actor={actor}
          />
        </Suspense>
      </div>
    </div>
  );
}
