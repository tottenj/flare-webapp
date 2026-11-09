import DashboardInfoShellContainer from '@/components/dashboard/dashboardInfoShell/DashboardInfoShellContainer';
import OrgSettingsModalTrigger from '@/components/dashboard/settings/orgSettings/OrgSettingsModalTrigger';
import EventCardOrgRecentContainer from '@/components/events/EventCard/EventCardOrgUpcomingContainer';
import EventCardSkeleton from '@/components/events/EventCard/presentational/EventCardSkeleton';
import EventListContainerOrg from '@/components/events/EventList/EventListContainerOrg';
import EventListContainerSaved from '@/components/events/EventList/EventListContainerSaved';
import EventListSkeleton from '@/components/events/EventList/presentational/EventListSkeleton';
import QueryTabs from '@/components/inputs/hero/tab/QueryTabs';
import CreateEventModalWrapper from '@/components/wrappers/CreateEventModalWrapper';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { OrgEventFilter } from '@/lib/types/OrgEventFilter';
import { Suspense } from 'react';

export default async function OrgDashboardShell({
  filters,
  organizationId,
}: {
  filters?: OrgEventFilter;
  organizationId: string;
}) {
  const { ctx, membership } = await UserContextService.requireOrg(organizationId);
  const { organization } = membership;
  const actor = UserContextService.getOrgActor(ctx, membership);

  return (
    <div className="grid h-full w-full grid-cols-1 grid-rows-[1fr_2fr_2fr] gap-4 md:grid-cols-2">
      <DashboardInfoShellContainer
        profilePicPath={ctx.user.profilePic}
        settingsTrigger={<OrgSettingsModalTrigger />}
        profileInfo={
          <div>
            <p>{organization.orgName}</p>
            <p>{ctx.user.email}</p>
            <p> {organization.status}</p>
          </div>
        }
      />

      <div
        data-cy="my-events-container"
        className="row-span-3 h-full w-full rounded-2xl bg-white p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between pb-4">
          <h2>My Events</h2>
          <CreateEventModalWrapper
            orgName={organization.orgName}
            organizationId={organization.id}
          />
        </div>
        <div className="mb-4 w-full">
          <QueryTabs
            param="status"
            defaultValue="published"
            color="primary"
            tabs={[
              { key: 'published', label: 'Published' },
              { key: 'draft', label: 'Draft' },
            ]}
          />
        </div>
        <Suspense fallback={<EventListSkeleton />}>
          <EventListContainerOrg actor={actor} filters={filters} orgName={organization.orgName} />
        </Suspense>
      </div>
      <div
        data-cy="upcoming-container"
        className="flex h-full w-full flex-col rounded-2xl bg-white pt-4 pb-4"
      >
        <h2 className="pb-8 text-center">Next Upcoming Event</h2>
        <Suspense fallback={<EventCardSkeleton />}>
          <EventCardOrgRecentContainer orgId={organization.id} actor={actor} />
        </Suspense>
      </div>
      <div
        data-cy="saved-events-container"
        className="h-full w-full rounded-2xl bg-white p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between pb-4">
          <h2>Saved Events</h2>
        </div>
        <Suspense fallback={<EventListSkeleton />}>
          <EventListContainerSaved actor={actor} />
        </Suspense>
      </div>
    </div>
  );
}
