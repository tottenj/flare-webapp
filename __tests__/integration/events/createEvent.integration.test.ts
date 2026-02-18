import ImageService from '@/lib/services/imageService/ImageService';
import { resetTestDb } from '../../utils/restTestDb';
import { AgeRestriction, EventCategory } from '@prisma/client';
import { PRICE_TYPE } from '@/lib/types/PriceType';
import { EventService } from '@/lib/services/eventService/eventService';
import { expect } from '@jest/globals';
import { imageAssetDal } from '@/lib/dal/imageAssetDal/ImageAssetDal';

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: {
    deleteByStoragePath: jest.fn(),
  },
}));

describe('Create Event Integration Tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    (ImageService.deleteByStoragePath as jest.Mock).mockResolvedValue(undefined);
    await resetTestDb();
  });

  it('successfully creates event with valid data', async () => {
    const authUser = {
      orgId: 'org1',
      firebaseUid: 'uid3',
      userId: '3',
    };
    const input = {
      eventName: 'Test Event',
      eventDescription: 'This is a test event',
      startDateTime: '2026-02-15T19:00:00-05:00[America/Toronto]',
      status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
      ageRestriction: AgeRestriction.ALL_AGES,
      location: {
        placeId: 'placeId',
        address: '123 Test St',
        lat: 23.456,
        lng: 45.678,
      },
      image: {
        storagePath: 'events/uid3/image.jpg',
        contentType: 'image/jpeg',
        sizeBytes: 1024,
        originalName: 'image.jpg',
      },
      category: EventCategory.SOCIAL,
      priceType: PRICE_TYPE.Free,
      tags: [],
    };

    await expect(EventService.createEvent(authUser, input)).resolves.not.toThrow();
    const event = await prisma.flareEvent.findFirst({
      where: { organizationId: 'org1', title: 'Test Event' },
      include: {
        image: true,
        location: true,
      },
    });
    expect(event).toBeTruthy();
    expect(event?.title).toBe(input.eventName);
    expect(event?.location?.address).toBe(input.location.address);
    expect(event?.image?.storagePath).toBe(input.image.storagePath);
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('successfully creates event without location', async () => {
    const authUser = {
      orgId: 'org1',
      firebaseUid: 'uid3',
      userId: '3',
    };
    const input = {
      eventName: 'Test Event No Location',
      eventDescription: 'This is a test event without location',
      startDateTime: '2026-02-15T19:00:00-05:00[America/Toronto]',
      status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
      ageRestriction: AgeRestriction.ALL_AGES,
      image: {
        storagePath: 'events/uid3/image2.jpg',
        contentType: 'image/jpeg',
        sizeBytes: 1024,
        originalName: 'image2.jpg',
      },
      category: EventCategory.SOCIAL,
      priceType: PRICE_TYPE.Free,
      tags: [],
    };

    await expect(EventService.createEvent(authUser, input)).resolves.not.toThrow();

    const event = await prisma.flareEvent.findFirst({
      where: { organizationId: 'org1', title: 'Test Event No Location' },
      include: {
        image: true,
        location: true,
      },
    });
    expect(event).toBeTruthy();
    expect(event?.title).toBe(input.eventName);
    expect(event?.location).toBeNull();
    expect(event?.image?.storagePath).toBe(input.image.storagePath);
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('throws error and deletes image if event creation fails', async () => {
    const authUser = {
      orgId: 'org1',
      firebaseUid: 'uid3',
      userId: '3',
    };
    const input = {
      eventName: 'Test Event Error',
      eventDescription: 'This event will fail to create',
      startDateTime: '2026-02-15T19:00:00-05:00[America/Toronto]',
      status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
      ageRestriction: AgeRestriction.ALL_AGES,
      location: {
        placeId: 'placeId',
        address: '123 Test St',
        lat: 23.456,
        lng: 45.678,
      },
      image: {
        storagePath: 'events/uid3/image-error.jpg',
        contentType: 'image/jpeg',
        sizeBytes: 1024,
        originalName: 'image-error.jpg',
      },
      category: EventCategory.SOCIAL,
      priceType: PRICE_TYPE.Free,
      tags: [],
    };

    // Mock the DAL to throw an error when trying to create the event
    jest.spyOn(imageAssetDal, 'create').mockRejectedValueOnce(new Error('DB error'));

    await expect(EventService.createEvent(authUser, input)).rejects.toThrow('DB error');
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith('events/uid3/image-error.jpg');
    const event = await prisma.flareEvent.findFirst({
      where: { organizationId: 'org1', title: 'Test Event Error' },
    });
    expect(event).toBeNull();
  });

  it('throws error if image storage path is invalid', async () => {
    const authUser = {
      orgId: 'org1',
      firebaseUid: 'uid3',
      userId: '3',
    };
    const input = {
      eventName: 'Test Event Invalid Image Path',
      eventDescription: 'This event has an invalid image path',
      startDateTime: '2026-02-15T19:00:00-05:00[America/Toronto]',
      status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
      ageRestriction: AgeRestriction.ALL_AGES,
      location: {
        placeId: 'placeId',
        address: '123 Test St',
        lat: 23.456,
        lng: 45.678,
      },
      image: {
        storagePath: 'invalid-path/image.jpg',
        contentType: 'image/jpeg',
        sizeBytes: 1024,
        originalName: 'image.jpg',
      },
      category: EventCategory.SOCIAL,
      priceType: PRICE_TYPE.Free,
      tags: [],
    };

    await expect(EventService.createEvent(authUser, input)).rejects.toThrow('AUTH_UNAUTHORIZED');
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    const event = await prisma.flareEvent.findFirst({
      where: { organizationId: 'org1', title: 'Test Event Invalid Image Path' },
    });
    expect(event).toBeNull();
  });
});
