import AdminOrgList from '@/components/admin/adminOrgList/AdminOrgList';
import { AdminService } from '@/lib/services/adminService/AdminService';
import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';

export default async function AdminOrgListWrapper({ actor }: { actor: AuthenticatedUser }) {
  const cards = await AdminService.getUnverifiedOrgCards(actor);

  return (
    <div className="bg-default flex flex-col gap-4 rounded-lg p-4">
      <h1>Unverified Organizations</h1>
      <AdminOrgList cards={cards} />
    </div>
  );
}
