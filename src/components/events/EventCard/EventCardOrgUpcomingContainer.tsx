import EventCardPresentational from '@/components/events/EventCard/presentational/EventCardPresentational';
import { EventService } from '@/lib/services/eventService/eventService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import mapEventDtoToEventCardViewModel from '@/lib/types/dto/event/mapEventDtoToEventCardViewModel/mapEventDtoToEventCardViewModel';

export default async function EventCardOrgRecentContainer({
  orgId,
  actor,
}: {
  orgId: string;
  actor?: AuthenticatedOrganization;
}) {
  const eventDto = await EventService.getOrgUpcomingEvent(orgId, actor, actor?.userId);
  if (!eventDto) return null;
  const event = await mapEventDtoToEventCardViewModel(eventDto, {
    userId: actor?.userId,
    orgId: actor?.orgId,
  });
  if (!event) return null;
  return <EventCardPresentational event={event} />;
}
