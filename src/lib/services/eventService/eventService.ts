import 'server-only';
import { eventDal } from '@/lib/dal/eventDal/EventDal';
import { imageAssetDal } from '@/lib/dal/imageAssetDal/ImageAssetDal';
import { locationDal } from '@/lib/dal/locationDal/LocationDal';
import {
  CreateEventResolved,
  EventDomain,
  EventDomainProps,
} from '@/lib/domain/eventDomain/EventDomain';
import { AuthErrors } from '@/lib/errors/authError';
import { AppError } from '@/lib/errors/AppError';
import ensure from '@/lib/errors/ensure/ensure';
import { CreateEvent } from '@/lib/schemas/event/createEventFormSchema';
import ImageService from '@/lib/services/imageService/ImageService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import { prisma } from '../../../../prisma/prismaClient';
import { OrgEventFilter, OrgEventFilterSchema } from '@/lib/types/OrgEventFilter';
import type { EventDto } from '@/lib/schemas/event/eventDtoSchema';
import { mapEventRowToDto } from '@/lib/types/dto/event/EventDto';
import { UserEventFilter, userEventFilterSchema } from '@/lib/types/UserEventFilter';
import tagService from '@/lib/services/tagService/tagService';
import EventPermission from '@/lib/permissions/eventPermission/EventPermission';
import { EventErrors } from '@/lib/errors/eventErrors/EventErrors';
import { EditEventData } from '@/lib/schemas/event/editEventDataSchema';
import { EditEventInput } from '@/lib/schemas/event/editEventInputSchema';
import { logger } from '@/lib/logger';
import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';
import {
  EventFilterDataDto,
  mapEventFilterDataToDto,
} from '@/lib/types/dto/event/EventFilterDataDto';

export class EventService {
  private static async assertCanEdit(eventId: string, actor: AuthenticatedOrganization) {
    const event = await eventDal.getOwnerInfo(eventId);
    if (!event) throw EventErrors.EventNotFound();
    if (!EventPermission.canEdit({ organizationId: event.organizationId }, actor))
      throw AuthErrors.Unauthorized();
  }

  private static async attatchSavedStatus(dto: EventDto, viewerUserId?: string): Promise<EventDto> {
    if (viewerUserId) {
      dto.viewer = {
        isSaved: await eventDal.isSavedByUser(dto.id, viewerUserId),
      };
    }
    return dto;
  }

  static async createEvent(authenticatedUser: AuthenticatedOrganization, eventData: CreateEvent) {
    if (!EventPermission.canCreate(authenticatedUser)) throw AuthErrors.Unauthorized();
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
    actor?: AuthenticatedOrganization,
    viewerUserId?: string
  ): Promise<EventDto | null> {
    const event = await eventDal.getEvent(eventId);
    if (!event) return null;
    if (!EventPermission.canView(event, actor)) return null;
    const dto = mapEventRowToDto(event);
    if (viewerUserId) {
      await this.attatchSavedStatus(dto, viewerUserId);
    }
    return dto;
  }

  static async getOrgUpcomingEvent(
    orgId: string,
    actor?: AuthenticatedOrganization,
    viewerUserId?: string,
    startsAfter: Date = new Date()
  ): Promise<EventDto | null> {
    const event = await eventDal.getUpcomingOrgEvent(orgId, startsAfter);
    if (!event) return null;
    if (!EventPermission.canView(event, actor)) return null;
    const dto = mapEventRowToDto(event);
    if (viewerUserId) {
      await this.attatchSavedStatus(dto, viewerUserId);
    }
    return dto;
  }

  static async getEditData(eventId: string, actor: AuthenticatedOrganization) {
    await this.assertCanEdit(eventId, actor);
    const [eventRow, eventAssets] = await Promise.all([
      eventDal.getEvent(eventId),
      eventDal.getEditData(eventId),
    ]);
    if (!eventRow || !eventAssets) throw EventErrors.EventNotFound();

    const event = mapEventRowToDto(eventRow);
    const [imageUrl, location] = await Promise.all([
      eventAssets.image?.storagePath
        ? ImageService.getDownloadUrl(eventAssets.image.storagePath).catch((error) => {
            if (
              error instanceof AppError &&
              (error.code === 'STORAGE_MISSING_PATH' || error.code === 'STORAGE_INVALID_PATH')
            ) {
              logger.warn('EVENT_EDIT_IMAGE_MISSING', {
                eventId,
                storagePath: eventAssets.image?.storagePath,
                errorCode: error.code,
              });
              return undefined;
            }
            throw error;
          })
        : Promise.resolve(undefined),
      eventAssets.locationId ? locationDal.get(eventAssets.locationId) : Promise.resolve(undefined),
    ]);

    const editData: EditEventData = {
      event,
      imageUrl,
      location: location
        ? {
            address: location.address,
            placeId: location.placeId,
            lat: location.latitude,
            lng: location.longitude,
          }
        : undefined,

      imageMetadata: eventAssets.image
        ? {
            contentType: eventAssets.image.contentType ?? undefined,
            sizeBytes: eventAssets.image.sizeBytes ?? undefined,
            storagePath: eventAssets.image.storagePath ?? undefined,
            originalName: eventAssets.image.originalName ?? undefined,
          }
        : undefined,
    };
    return editData;
  }

  static async editEvent(
    eventId: string,
    actor: AuthenticatedOrganization,
    eventData: EditEventInput
  ) {
    await this.assertCanEdit(eventId, actor);
    const prevEvent = await eventDal.getEvent(eventId);
    ensure(prevEvent, EventErrors.EventNotFound());
    let shouldDeleteOldImage = false;
    let oldImagePath: string | null = null;

    await prisma.$transaction(async (tx) => {
      let imageId: string | undefined = undefined;
      let locationId: string | undefined = undefined;
      let allTagIds: string[] | undefined = undefined;

      if (eventData.image && eventData.image.isNew) {
        ensure(
          eventData.image.metadata.storagePath.startsWith(`events/${actor.firebaseUid}`),
          AuthErrors.Unauthorized()
        );
        const imageAsset = await imageAssetDal.create(eventData.image.metadata, tx);
        imageId = imageAsset.id;

        if (prevEvent.imageId) {
          await imageAssetDal.delete(prevEvent.imageId, tx);
          shouldDeleteOldImage = true;
          oldImagePath = prevEvent.image?.storagePath ?? null;
        }
      }

      if (eventData.location && prevEvent.location?.placeId !== eventData.location.placeId) {
        const location = await locationDal.create(eventData.location, tx);
        locationId = location.id;
      }

      if (eventData.tags !== undefined) {
        allTagIds = await tagService.applyTagDiff(prevEvent.tags, eventData.tags, tx);
      }

      const existing: EventDomainProps = {
        organizationId: prevEvent.organizationId,
        category: prevEvent.category,
        title: prevEvent.title,
        description: prevEvent.description,
        ageRestriction: prevEvent.ageRestriction,
        status: prevEvent.status,
        publishedAt: prevEvent.publishedAt,
        imageId: prevEvent.imageId,
        startsAtUTC: prevEvent.startsAtUTC,
        endsAtUTC: prevEvent.endsAtUTC,
        timezone: prevEvent.timezone,
        locationId: prevEvent.locationId,
        pricingType: prevEvent.pricingType,
        minPriceCents: prevEvent.minPriceCents,
        maxPriceCents: prevEvent.maxPriceCents,
        tags: prevEvent.tags.map((t) => t.tag.id),
      };

      const eventEditInput = EventDomain.onEdit(
        {
          ...eventData,
          imageId,
          locationId,
          tags: allTagIds,
        },
        existing
      );
      await eventDal.edit(eventId, eventEditInput.props, tx);
    });
    if (shouldDeleteOldImage && oldImagePath) {
      await ImageService.deleteByStoragePath(oldImagePath).catch((error) => {
        logger.error('STORAGE_DELETE_FAILED', {
          error,
          storagePath: oldImagePath,
          eventId,
        });
      });
    }
  }

  static async getPublicFilterData(
    filters: Pick<UserEventFilter, 'placeId'>
  ): Promise<EventFilterDataDto> {
    let location = null;
    if (filters.placeId) {
      location = await locationDal.getByPlaceId(filters.placeId);
    }
    return mapEventFilterDataToDto({ location });
  }

  static async saveEvent(
    eventId: string,
    actor: AuthenticatedOrganization | AuthenticatedUser,
    save: boolean
  ) {
    const event = await eventDal.getEvent(eventId);
    if (!event) throw EventErrors.EventNotFound();

    if ('orgId' in actor && event.organizationId === actor.orgId) {
      throw EventErrors.CannotSaveOwnEvent();
    }

    await eventDal.saveEvent(eventId, actor.userId, save);
  }

  static async listSavedEvents(actor: AuthenticatedUser) {
    const events = await eventDal.listSavedEvents(actor.userId);
    return events.map((event) => mapEventRowToDto(event));
  }
}
