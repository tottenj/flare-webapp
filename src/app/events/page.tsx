import EventListWithFiltersContainer from '@/components/events/EventList/EventListWithFiltersContainer';
import { mapUrlFiltersToUserEventFilters } from '@/lib/mappers/mapUrlFiltersToUserEventFilters/mapUrlFiltersToUserEventFilters';
import { UserEventUrlFilter } from '@/lib/schemas/event/userEventUrlFilterSchema';
import { UserEventUrlFilterSchema } from '@/lib/schemas/event/userEventUrlFilterSchema';

export default async function page(props: { searchParams?: Promise<UserEventUrlFilter> }) {
  const params = await props.searchParams;
  const parsed = UserEventUrlFilterSchema.safeParse(params ?? {});
  const urlFilters = parsed.success ? parsed.data : UserEventUrlFilterSchema.parse({});
  const filters = mapUrlFiltersToUserEventFilters(urlFilters);

  return <EventListWithFiltersContainer filters={filters} />;
}
