import { EventStatus } from '@prisma/client';
import { OrgEventFilter } from '@/lib/types/OrgEventFilter';
import { OrgEventUrlFilters } from '@/lib/schemas/event/orgEventUrlFilterSchema';

export function mapUrlFiltersToOrgEventFilters(filters: OrgEventUrlFilters): OrgEventFilter {
  return {
    status:
      filters.status === 'published'
        ? EventStatus.PUBLISHED
        : filters.status === 'draft'
          ? EventStatus.DRAFT
          : undefined,
  };
}
