'use server'
import OrgDashboardInfoPresentational from '@/components/dashboard/orgDashboard/orgDashboardInfo/OrgDashboardInfoPresentational';
import { UserContextService } from '@/lib/services/userContextService/userContextService';

export default async function OrgDashboardShell() {
  const ctx = await UserContextService.requireOrg();

  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-[1fr_3fr] gap-4">
      <OrgDashboardInfoPresentational
        profilePicPath={ctx.user.profilePic}
        orgName={ctx.profile.orgProfile!.orgName}
        email={ctx.user.email}
        status={ctx.profile.orgProfile!.status}
      />
    </div>
  );
}
