import EditProfilePictureButtonContainer from '@/components/buttons/editProfilePictureButton/EditProfilePictureButtonContainer';
import DashboardInfoShell from '@/components/dashboard/dashboardInfoShell/DashboardInfoShell';
import OrgSettingsModalTrigger from '@/components/dashboard/settings/orgSettings/OrgSettingsModalTrigger';
import EventCardOrgRecentContainer from '@/components/events/EventCard/EventCardOrgUpcomingContainer';
import EventCardSkeleton from '@/components/events/EventCard/presentational/EventCardSkeleton';
import EventListContainerOrg from '@/components/events/EventList/EventListContainerOrg';
import EventListSkeleton from '@/components/events/EventList/presentational/EventListSkeleton';
import QueryTabs from '@/components/inputs/hero/tab/QueryTabs';
import ProfilePictureContainer from '@/components/profiles/profilePicture/ProfilePictureContainer';
import CreateEventModalWrapper from '@/components/wrappers/CreateEventModalWrapper';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { OrgEventFilter } from '@/lib/types/OrgEventFilter';
import { Suspense } from 'react';

export default async function OrgDashboardShell({ filters }: { filters?: OrgEventFilter }) {
  const ctx = await UserContextService.requireOrg();
  const actor = UserContextService.getOrgActor(ctx);
  const PROFILE_PIC_SIZE = 175;

  return (
    <div className="grid h-full w-full grid-cols-1 grid-rows-[1fr_3fr] gap-4 md:grid-cols-2">
      <DashboardInfoShell
        profilePicSize={PROFILE_PIC_SIZE}
        editProfilePictureTrigger={<EditProfilePictureButtonContainer />}
        profilePicture={
          <ProfilePictureContainer profilePicPath={ctx.user.profilePic} size={PROFILE_PIC_SIZE} />
        }
        settingsTrigger={
          <OrgSettingsModalTrigger />
        }
        profileInfo={
          <div>
            <p>{ctx.profile.orgProfile.orgName}</p>
            <p>{ctx.user.email}</p>
            <p> {ctx.profile.orgProfile.status}</p>
          </div>
        }
      />

      <div
        data-cy="my-events-container"
        className="row-span-2 h-full w-full rounded-2xl bg-white p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between pb-4">
          <h2>My Events</h2>
          <CreateEventModalWrapper orgName={ctx.profile.orgProfile.orgName} />
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
          <EventListContainerOrg actor={actor} filters={filters} orgName={ctx.profile.orgProfile.orgName} />
        </Suspense>
      </div>
      <div
        data-cy="upcoming-container"
        className="flex h-full w-full flex-col rounded-2xl bg-white pt-4 pb-4"
      >
        <h2 className="pb-8 text-center">Next Upcoming Event</h2>
        <Suspense fallback={<EventCardSkeleton />}>
          <EventCardOrgRecentContainer orgId={ctx.profile.orgProfile.id} actor={actor} />
        </Suspense>
      </div>
    </div>
  );
}
