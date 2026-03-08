import EventCardPresentational from '@/components/events/EventCard/presentational/EventCardPresentational';
import { EventService } from '@/lib/services/eventService/eventService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import mapEventDtoToEventCardViewModel from '@/lib/types/dto/mapEventDtoToEventCardViewModel/mapEventDtoToEventCardViewModel';

export default async function EventCardOrgRecentContainer({
  orgId,
  actor,
}: {
  orgId: string;
  actor?: AuthenticatedOrganization;
}) {
  const eventDto = await EventService.getOrgUpcomingEvent(orgId, actor);
  if (!eventDto) return null;
  const event = await mapEventDtoToEventCardViewModel(eventDto);
  if (!event) return null;
  return <EventCardPresentational event={event} />;
}
