import OrgDashboardShell from '@/components/dashboard/orgDashboardShell/OrgDashboardShell';
import { mapUrlFiltersToOrgEventFilters } from '@/lib/mappers/mapUrlFiltersToOrgEventFilters/mapUrlFiltersToOrgEventFilters';
import { OrgEventUrlFilterSchema } from '@/lib/schemas/event/orgEventUrlFilterSchema';
import { UserContextService } from '@/lib/services/userContextService/userContextService';

export default async function DashboardPage(props: {
  searchParams?: Promise<{
    status?: string;
  }>;
}) {
  const ctx = await UserContextService.requireUser();
  const params = await props.searchParams;

  if (ctx.flags.isOrg) {
    const parsed = OrgEventUrlFilterSchema.safeParse(params ?? {});
    const urlFilters = parsed.success ? parsed.data : OrgEventUrlFilterSchema.parse({}); // fallback defaults
    const filters = mapUrlFiltersToOrgEventFilters(urlFilters);
    return <OrgDashboardShell filters={filters} />;
  }
}
