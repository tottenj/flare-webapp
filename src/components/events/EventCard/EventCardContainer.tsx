import EventCardPresentational, {
  EventCardDto,
} from '@/components/events/EventCard/EventCardPresentational';
import { EventService } from '@/lib/services/eventService/eventService';
import mapEventDtoToCardDto from '@/lib/types/dto/mapEventDtoToEventCard';

export default async function EventCardContainer({ eventId }: { eventId: string }) {
  let event: EventCardDto | null;
  const eventDto = await EventService.getEvent(eventId);
  if (!eventDto) return null;
  event = await mapEventDtoToCardDto(eventDto);
  if (!event) return null;

  return <EventCardPresentational event={event} />;
}
