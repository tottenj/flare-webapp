import EventCardPresentational, {
  EventCardViewModel,
} from '@/components/events/EventCard/EventCardPresentational';
import { EventService } from '@/lib/services/eventService/eventService';
import mapEventDtoToEventCardViewModel from '@/lib/types/dto/mapEventDtoToEventCardViewModel/mapEventDtoToEventCardViewModel';

export default async function EventCardContainer({ eventId }: { eventId: string }) {
  let event: EventCardViewModel | null;
  const eventDto = await EventService.getEventById(eventId);
  if (!eventDto) return null;
  event = await mapEventDtoToEventCardViewModel(eventDto);
  if (!event) return null;

  return <EventCardPresentational event={event} />;
}
