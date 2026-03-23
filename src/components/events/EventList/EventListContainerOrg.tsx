import EditEventContainer from '@/components/events/EditEvent/EditEventContainer';
import EventList from '@/components/events/EventList/presentational/EventList';
import Skeleton from '@/components/skeletons/BaseSkeleton/BaseSkeleton';
import { EventService } from '@/lib/services/eventService/eventService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import { EventDto } from '@/lib/types/dto/EventDto';
import { OrgEventFilter } from '@/lib/types/OrgEventFilter';
import { Suspense } from 'react';

export default async function EventListContainerOrg({
  actor,
  orgName,
  filters,
}: {
  actor: AuthenticatedOrganization;
  orgName?: string;
  filters?: OrgEventFilter;
}) {
  let events: EventDto[] = [];
  try {
    events = await EventService.listEventsOrg(actor, filters);
  } catch (error) {
    console.log(error);
  }
  return (
    <EventList
      events={events}
      renderActions={(event) => (
        <Suspense fallback={<Skeleton className="h-8 w-8 rounded-full"></Skeleton>}>
          <EditEventContainer orgName={orgName} event={event} />
        </Suspense>
      )}
    />
  );
}
