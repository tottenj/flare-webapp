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
import { mapEventRowToDto } from '@/lib/types/dto/EventDto';

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
        const resolved: CreateEventResolved = {
          ...eventData,
          imageId: imageAsset.id,
          locationId: location?.id,
        };
        const eventCreateInput = EventDomain.onCreate(resolved, authenticatedUser.orgId);
        await eventDal.create(eventCreateInput.props, tx);
      });
    } catch (error) {
      await ImageService.deleteByStoragePath(eventData.image.storagePath);
      throw error;
    }
  }

  static async listEventsOrg(orgId: string, filters?: OrgEventFilter) {
    const sanitized = OrgEventFilterSchema.safeParse(filters ?? {});
    const { data } = sanitized;
    const events = await eventDal.listEventsOrg(orgId, data);
    return events.map((event) => mapEventRowToDto(event));
  }
}
