import OrgDashboardInfoPresentational from '@/components/dashboard/orgDashboardInfo/OrgDashboardInfoPresentational';
import { UserContextService } from '@/lib/services/userContextService/userContextService';

export default async function page() {
  const ctx = await UserContextService.requireOrg();


  return (
  <div className='grid grid-cols-2 grid-rows-[1fr_3fr] w-full h-full gap-4'>
    <OrgDashboardInfoPresentational profilePicPath={ctx.user.profilePic ?? undefined} orgName={ctx.profile.orgProfile!.orgName} email={ctx.user.email} status={ctx.profile.orgProfile!.status}/>
  </div>
  )
}
