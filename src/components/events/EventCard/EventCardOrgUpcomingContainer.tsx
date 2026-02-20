import EventCardPresentational from '@/components/events/EventCard/EventCardPresentational';
import { EventService } from '@/lib/services/eventService/eventService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import mapEventDtoToCardDto from '@/lib/types/dto/mapEventDtoToEventCard';

export default async function EventCardOrgRecentContainer({ orgId, actor }: { orgId: string, actor?:AuthenticatedOrganization }) {
  const eventDto = await EventService.getOrgUpcomingEvent(orgId, actor);
  if (!eventDto) return null;
  const event = await mapEventDtoToCardDto(eventDto);
  if (!event) return null;
  return <EventCardPresentational event={event} />;
}
