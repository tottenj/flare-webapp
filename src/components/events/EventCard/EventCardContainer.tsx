import EventCardPresentational, {
  EventCardViewModel,
} from '@/components/events/EventCard/presentational/EventCardPresentational';
import { logger } from '@/lib/logger';
import { EventService } from '@/lib/services/eventService/eventService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import mapEventDtoToEventCardViewModel from '@/lib/types/dto/event/mapEventDtoToEventCardViewModel/mapEventDtoToEventCardViewModel';

export default async function EventCardContainer({
  eventId,
  actor,
  viewerUserId,
}: {
  eventId: string;
  actor?: AuthenticatedOrganization;
  viewerUserId?: string;
}) {
  let event: EventCardViewModel | null;
  let eventDto;
  try {
    eventDto = await EventService.getEventById(eventId, actor, viewerUserId);
  } catch (error) {
    logger.error('Error fetching event by ID', { eventId, error });
    return null;
  }
  if (!eventDto) return null;
  try {
    event = await mapEventDtoToEventCardViewModel(eventDto, {
      userId: viewerUserId,
      orgId: actor?.orgId,
    });
  } catch (error) {
    logger.error('Error mapping EventDto to EventCardViewModel', { eventId, error });
    return null;
  }
  if (!event) return null;

  return <EventCardPresentational event={event} />;
}
