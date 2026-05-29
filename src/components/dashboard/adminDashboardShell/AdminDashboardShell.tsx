import AdminOrgListWrapper from '@/components/admin/adminOrgList/AdminOrgListWrapper';
import DashboardInfoShellContainer from '@/components/dashboard/dashboardInfoShell/DashboardInfoShellContainer';
import { UserContextService } from '@/lib/services/userContextService/userContextService';

export default async function AdminDashboardShell() {
  const ctx = await UserContextService.requireAdmin();
  const actor = UserContextService.getUserActor(ctx);

  return (
    <div className="grid h-full w-full grid-cols-1  gap-4 md:grid-cols-2">
      <DashboardInfoShellContainer
        profilePicPath={ctx.user.profilePic}
        profileInfo={
          <div>
            <p>{ctx.user.email}</p>
          </div>
        }
      />
      <AdminOrgListWrapper actor={actor} />
    </div>
  );
}
