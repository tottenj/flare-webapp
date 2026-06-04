import DashboardInfoShellContainer from '@/components/dashboard/dashboardInfoShell/DashboardInfoShellContainer';
import UserSettingsModalTrigger from '@/components/dashboard/settings/userSettings/UserSettingsModalTrigger';
import EventListContainerSaved from '@/components/events/EventList/EventListContainerSaved';
import EventListSkeleton from '@/components/events/EventList/presentational/EventListSkeleton';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { Suspense } from 'react';

export default async function UserDashboardShell() {
  const ctx = await UserContextService.requireUser();
  const actor = UserContextService.getUserActor(ctx);

  return (
    <div className="grid h-full w-full grid-cols-1 grid-rows-[1fr_3fr] gap-4 md:grid-cols-2">
      <DashboardInfoShellContainer
        profilePicPath={ctx.user.profilePic}
        settingsTrigger={<UserSettingsModalTrigger />}
        profileInfo={
          <div>
            <p>{ctx.user.email}</p>
          </div>
        }
      />

      <div
        data-cy="saved-events-container"
        className="row-span-2 h-full w-full rounded-2xl bg-white p-8 shadow-2xl"
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
