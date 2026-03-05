import EventCardPresentational, {
  EventCardViewModel,
} from '@/components/events/EventCard/EventCardPresentational';
import { EventService } from '@/lib/services/eventService/eventService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import mapEventDtoToEventCardViewModel from '@/lib/types/dto/mapEventDtoToEventCardViewModel/mapEventDtoToEventCardViewModel';

export default async function EventCardContainer({ eventId, actor }: { eventId: string, actor?: AuthenticatedOrganization }) {
  let event: EventCardViewModel | null;
  const eventDto = await EventService.getEventById(eventId, actor);
  if (!eventDto) return null;
  event = await mapEventDtoToEventCardViewModel(eventDto);
  if (!event) return null;

  return <EventCardPresentational event={event} />;
}
