import AdminDashboardShell from '@/components/dashboard/adminDashboardShell/AdminDashboardShell';
import OrgDashboardShell from '@/components/dashboard/orgDashboardShell/OrgDashboardShell';
import UserDashboardShell from '@/components/dashboard/userDashboardShell/UserDashboardShell';
import { mapUrlFiltersToOrgEventFilters } from '@/lib/mappers/mapUrlFiltersToOrgEventFilters/mapUrlFiltersToOrgEventFilters';
import { OrgEventUrlFilterSchema } from '@/lib/schemas/event/orgEventUrlFilterSchema';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { redirect } from 'next/navigation';

type DashboardShellProps = {
  searchParams?: Promise<{ orgId?: string; status?: string }>;
};

export default async function DashboardShell({ searchParams }: DashboardShellProps) {
  const context = await UserContextService.requireUser();
  const params = await searchParams;
  const memberships = context.organizationMemberships;

  const membership = params?.orgId
    ? UserContextService.getMembership(context, params.orgId)
    : context.flags.isAdmin
      ? undefined
      : memberships[0];

  if (params?.orgId && !membership) redirect('/dashboard');

  const parsed = OrgEventUrlFilterSchema.safeParse(params ?? {});
  const filters = mapUrlFiltersToOrgEventFilters(
    parsed.success ? parsed.data : OrgEventUrlFilterSchema.parse({})
  );

  return membership ? (
    <OrgDashboardShell organizationId={membership.organization.id} filters={filters} />
  ) : context.flags.isAdmin ? (
    <AdminDashboardShell />
  ) : (
    <UserDashboardShell />
  );
}
