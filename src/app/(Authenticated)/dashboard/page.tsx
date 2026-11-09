import AdminDashboardShell from '@/components/dashboard/adminDashboardShell/AdminDashboardShell';
import OrgDashboardShell from '@/components/dashboard/orgDashboardShell/OrgDashboardShell';
import UserDashboardShell from '@/components/dashboard/userDashboardShell/UserDashboardShell';
import { mapUrlFiltersToOrgEventFilters } from '@/lib/mappers/mapUrlFiltersToOrgEventFilters/mapUrlFiltersToOrgEventFilters';
import { OrgEventUrlFilterSchema } from '@/lib/schemas/event/orgEventUrlFilterSchema';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage(props: {
  searchParams?: Promise<{ orgId?: string; status?: string }>;
}) {
  const ctx = await UserContextService.requireUser();
  const params = await props.searchParams;
  const membership = params?.orgId
    ? UserContextService.getMembership(ctx, params.orgId)
    : ctx.flags.isAdmin
      ? undefined
      : ctx.organizationMemberships[0];

  if (params?.orgId && !membership) redirect('/dashboard');

  const parsed = OrgEventUrlFilterSchema.safeParse(params ?? {});
  const filters = mapUrlFiltersToOrgEventFilters(
    parsed.success ? parsed.data : OrgEventUrlFilterSchema.parse({})
  );

  return (
    <>
      {(ctx.organizationMemberships.length > 1 ||
        (ctx.flags.isAdmin && ctx.organizationMemberships.length > 0)) && (
        <nav aria-label="Dashboard organizations" className="flex flex-wrap gap-4 pb-4">
          {ctx.flags.isAdmin && (
            <Link href="/dashboard" aria-current={membership ? undefined : 'page'}>
              Admin dashboard
            </Link>
          )}
          {ctx.organizationMemberships.map(({ organization }) => (
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
        <OrgDashboardShell filters={filters} organizationId={membership.organization.id} />
      ) : ctx.flags.isAdmin ? (
        <AdminDashboardShell />
      ) : (
        <UserDashboardShell />
      )}
    </>
  );
}
