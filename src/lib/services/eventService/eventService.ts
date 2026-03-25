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
import tagService from '@/lib/services/tagService/tagService';
import EventPermission from '@/lib/permissions/eventPermission/EventPermission';
import { EventErrors } from '@/lib/errors/eventErrors/EventErrors';
import { EditEventData } from '@/lib/schemas/event/editEventDataSchema';

export class EventService {
  private static async assertCanEdit(eventId: string, actor: AuthenticatedOrganization) {
    const event = await eventDal.getOwnerInfo(eventId);
    if (!event) throw EventErrors.EventNotFound();
    if (!EventPermission.canEdit({ organizationId: event.organizationId }, actor))
      throw AuthErrors.Unauthorized();
  }

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
        let tagIds: string[] = [];
        if (eventData.tags && eventData.tags.length > 0) {
          tagIds = await tagService.createAndIncrementMany(eventData.tags, tx);
        }
        const resolved: CreateEventResolved = {
          ...eventData,
          tags: tagIds,
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

  static async listEventsOrg(actor: AuthenticatedOrganization, filters?: OrgEventFilter) {
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
    if (!EventPermission.canView(event, actor)) return null;
    return mapEventRowToDto(event);
  }

  static async getOrgUpcomingEvent(
    orgId: string,
    actor?: AuthenticatedOrganization
  ): Promise<EventDto | null> {
    const event = await eventDal.getUpcomingOrgEvent(orgId);
    if (!event) return null;
    if (!EventPermission.canView(event, actor)) return null;
    return mapEventRowToDto(event);
  }

  static async getEditData(eventId: string, actor: AuthenticatedOrganization) {
    await this.assertCanEdit(eventId, actor);
    const event = await eventDal.getEditData(eventId);
    if (!event) throw EventErrors.EventNotFound();
    const [imageUrl, location] = await Promise.all([
      event.image?.storagePath
        ? ImageService.getDownloadUrl(event.image.storagePath)
        : Promise.resolve(undefined),
      event.locationId ? locationDal.get(event.locationId) : Promise.resolve(undefined),
    ]);

    const editData: EditEventData = {
      imageUrl,
      location: location
        ? {
            address: location.address,
            placeId: location.placeId,
            lat: location.latitude,
            lng: location.longitude,
          }
        : undefined,

      imageMetadata: event.image
        ? {
            contentType: event.image.contentType ?? undefined,
            sizeBytes: event.image.sizeBytes ?? undefined,
            storagePath: event.image.storagePath ?? undefined,
            originalName: event.image.originalName ?? undefined,
          }
        : undefined,
    };
    return editData;
  }
}
