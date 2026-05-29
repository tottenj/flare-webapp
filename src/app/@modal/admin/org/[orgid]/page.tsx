import AdminOrgContainer from '@/components/admin/adminOrgContainer/AdminOrgContainer';
import ModalRouter from '@/components/modals/ModalRouter/ModalRouter';
import {
  BaseModalSearchParams,
  BaseModalSearchParamsSchema,
} from '@/lib/schemas/routes/baseModalSearchParamsSchema';
import { UserContextService } from '@/lib/services/userContextService/userContextService';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ orgid: string }>;
  searchParams?: Promise<BaseModalSearchParams>;
}) {
  const { orgid } = await params;
  const searchRaw = await searchParams;
  const search = BaseModalSearchParamsSchema.safeParse(searchRaw);
  const returnTo = search.success ? search.data.returnTo : undefined;
  const ctx = await UserContextService.requireAdmin();
  const actor = UserContextService.getUserActor(ctx);

  return (
    <>
      <ModalRouter returnTo={returnTo} returnToFallback="/dashboard" modalProps={{ size: '5xl' }}>
        <AdminOrgContainer orgId={orgid} actor={actor} />
      </ModalRouter>
    </>
  );
}
