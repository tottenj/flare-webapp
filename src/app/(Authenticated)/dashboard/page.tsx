import AdminDashboardShell from '@/components/dashboard/adminDashboardShell/AdminDashboardShell';
import OrgDashboardShell from '@/components/dashboard/orgDashboardShell/OrgDashboardShell';
import UserDashboardShell from '@/components/dashboard/userDashboardShell/UserDashboardShell';
import { mapUrlFiltersToOrgEventFilters } from '@/lib/mappers/mapUrlFiltersToOrgEventFilters/mapUrlFiltersToOrgEventFilters';
import { OrgEventUrlFilterSchema } from '@/lib/schemas/event/orgEventUrlFilterSchema';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { redirect } from 'next/navigation';
import Link from 'next/link';


export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ orgId?: string; status?: string }>;
}) {
  const ctx = await UserContextService.requireUser();
  const params = await searchParams;
  const memberships = ctx.organizationMemberships;

  const membership = params?.orgId
    ? UserContextService.getMembership(ctx, params.orgId)
    : ctx.flags.isAdmin
      ? undefined
      : memberships[0];

  if (params?.orgId && !membership) redirect('/dashboard');

  const parsed = OrgEventUrlFilterSchema.safeParse(params ?? {});
  const filters = mapUrlFiltersToOrgEventFilters(
    parsed.success ? parsed.data : OrgEventUrlFilterSchema.parse({})
  );

  return (
    <>
      {(memberships.length > 1 || (ctx.flags.isAdmin && memberships.length > 0)) && (
        <nav aria-label="Dashboard organizations" className="flex flex-wrap gap-4 pb-4">
          {ctx.flags.isAdmin && <Link href="/dashboard">Admin dashboard</Link>}

          {memberships.map(({ organization }) => (
            <Link
              key={organization.id}
              href={{ pathname: '/dashboard', query: { orgId: organization.id } }}
              aria-current={membership?.organization.id === organization.id ? 'page' : undefined}
            >
              {organization.orgName}
            </Link>
          ))}
        </nav>
      )}

      {membership ? (
        <OrgDashboardShell organizationId={membership.organization.id} filters={filters} />
      ) : ctx.flags.isAdmin ? (
        <AdminDashboardShell />
      ) : (
        <UserDashboardShell />
      )}
    </>
  );
}