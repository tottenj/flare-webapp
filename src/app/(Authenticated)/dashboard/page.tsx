import OrgDashboardShell from '@/components/dashboard/orgDashboardShell/OrgDashboardShell';
import { UserContextService } from '@/lib/services/userContextService/userContextService';

export default async function DashboardPage() {
  const ctx = await UserContextService.requireUser();

  if (ctx.flags.isOrg) {
    return <OrgDashboardShell />;
  }


}
