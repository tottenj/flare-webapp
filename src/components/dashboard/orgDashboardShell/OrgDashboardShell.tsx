import OrgDashboardInfoPresentational from '@/components/dashboard/orgDashboard/orgDashboardInfo/OrgDashboardInfoPresentational';
import EventListContainerOrg from '@/components/events/EventList/EventListContainerOrg';

import CreateEventModalWrapper from '@/components/wrappers/CreateEventModalWrapper';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { Suspense } from 'react';

export default async function OrgDashboardShell() {
  const ctx = await UserContextService.requireOrg();

  return (
    <div className="grid h-full w-full grid-cols-1 grid-rows-[1fr_3fr] gap-4 md:grid-cols-2">
      <OrgDashboardInfoPresentational
        profilePicPath={ctx.user.profilePic}
        orgName={ctx.profile.orgProfile!.orgName}
        email={ctx.user.email}
        status={ctx.profile.orgProfile!.status}
      />
      <div className="row-span-2 h-full w-full rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4">
          <h2>My Events</h2>
          <CreateEventModalWrapper orgName={ctx.profile.orgProfile.orgName} />
        </div>
        <Suspense>
          <EventListContainerOrg orgId={ctx.profile.orgProfile.id} />
        </Suspense>
      </div>
    </div>
  );
}
