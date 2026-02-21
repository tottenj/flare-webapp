import 'server-only';
import { eventDal } from '@/lib/dal/eventDal/EventDal';
import { imageAssetDal } from '@/lib/dal/imageAssetDal/ImageAssetDal';
import { locationDal } from '@/lib/dal/locationDal/LocationDal';
import { CreateEventResolved, EventDomain } from '@/lib/domain/eventDomain/EventDomain';
import { AuthErrors } from '@/lib/errors/authError';
import ensure from '@/lib/errors/ensure/ensure';
import { CreateEvent } from '@/lib/schemas/event/createEventFormSchema';
import ImageService from '@/lib/services/imageService/ImageService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import { prisma } from '../../../../prisma/prismaClient';
import { OrgEventFilter, OrgEventFilterSchema } from '@/lib/types/OrgEventFilter';
import { EventDto, mapEventRowToDto } from '@/lib/types/dto/EventDto';
import { UserEventFilter, userEventFilterSchema } from '@/lib/types/UserEventFilter';
import { normalizeTag } from '@/lib/utils/normalize/normalizeTag/normalizeTag';
import { tagDal } from '@/lib/dal/tagDal/TagDal';

export class EventService {
  static async createEvent(authenticatedUser: AuthenticatedOrganization, eventData: CreateEvent) {
    ensure(
      eventData.image.storagePath.startsWith(`events/${authenticatedUser.firebaseUid}`),
      AuthErrors.Unauthorized()
    );
    try {
      await prisma.$transaction(async (tx) => {
        const imageAsset = await imageAssetDal.create(eventData.image, tx);
        let location = null;
        if (eventData.location) {
          location = await locationDal.create(eventData.location, tx);
        }
        const normalizedTags = [...new Set(eventData.tags.map((tag) => normalizeTag(tag)))];
        const tags = await Promise.all(
          normalizedTags.map(async (label) => {
            const res = await tagDal.upsertAndIncrement(label, tx);
            return res.label;
          })
        );
        const resolved: CreateEventResolved = {
          ...eventData,
          tags,
          imageId: imageAsset.id,
          locationId: location?.id,
        };
        const eventCreateInput = EventDomain.onCreate(resolved, authenticatedUser.orgId);
        await eventDal.create(eventCreateInput.props, tx);
      });
    } catch (error) {
      await ImageService.deleteByStoragePath(eventData.image.storagePath).catch((error) => {
        console.log(error);
      });
      throw error;
    }
  }

  static async listEventsOrg( actor: AuthenticatedOrganization, filters?: OrgEventFilter) {
    const sanitized = OrgEventFilterSchema.safeParse(filters ?? {});
    const { data } = sanitized;
    const events = await eventDal.listEventsOrg(actor.orgId, data);
    return events.map((event) => mapEventRowToDto(event));
  }

  static async listEventsUser(filters?: UserEventFilter) {
    const sanitzed = userEventFilterSchema.safeParse(filters ?? {});
    const { data } = sanitzed;
    const events = await eventDal.listEventsUser(data);
    return events.map((event) => mapEventRowToDto(event));
  }

  static async getEventById(
    eventId: string,
    actor?: AuthenticatedOrganization
  ): Promise<EventDto | null> {
    const event = await eventDal.getEvent(eventId);
    if (!event) return null;
    const isOwner = actor?.orgId === event.organizationId;
    const isPublished = event.status === 'PUBLISHED';
    const isOrgVerified = event.organization.status === 'VERIFIED';
    if (isOwner) {
      return mapEventRowToDto(event);
    }
    if (isPublished && isOrgVerified) {
      return mapEventRowToDto(event);
    }
    return null;
  }

  static async getOrgUpcomingEvent(
    orgId: string,
    actor?: AuthenticatedOrganization
  ): Promise<EventDto | null> {
    const event = await eventDal.getUpcomingOrgEvent(orgId);
    if (!event) return null;
    const isOwner = actor?.orgId === event.organizationId;
    const isOrgVerified = event.organization.status === 'VERIFIED';
    if (isOwner || isOrgVerified) {
      return mapEventRowToDto(event);
    }
    return null;
  }
}
