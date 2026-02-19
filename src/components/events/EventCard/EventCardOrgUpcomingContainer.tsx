import EventCardPresentational from '@/components/events/EventCard/EventCardPresentational';
import { EventService } from '@/lib/services/eventService/eventService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import mapEventDtoToCardDto from '@/lib/types/dto/mapEventDtoToEventCard';

export default async function EventCardOrgRecentContainer({ orgId }: { orgId: string }) {
  const ctx = await UserContextService.requireNone();
  const actor = ctx?.profile.orgProfile
    ? {
        orgId: ctx.profile.orgProfile.id,
        userId: ctx.user.id,
        firebaseUid: ctx.user.firebaseUid,
      }
    : undefined;
  const eventDto = await EventService.getOrgUpcomingEvent(orgId, actor);
  if (!eventDto) return null;
  const event = await mapEventDtoToCardDto(eventDto);
  if (!event) return null;

  return <EventCardPresentational event={event} />;
}
