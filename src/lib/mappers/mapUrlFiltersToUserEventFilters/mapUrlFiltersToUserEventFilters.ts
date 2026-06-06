import { UserEventUrlFilter } from '@/lib/schemas/event/userEventUrlFilterSchema';
import { UserEventFilter } from '@/lib/types/UserEventFilter';

export function mapUrlFiltersToUserEventFilters(filters: UserEventUrlFilter): UserEventFilter {
  return {
    category: filters.category,
    placeId: filters.placeId,
    distance: filters.distance
  };
}
