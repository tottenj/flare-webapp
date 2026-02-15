import { eventDal } from '@/lib/dal/eventDal/EventDal';
import  { imageAssetDal } from '@/lib/dal/imageAssetDal/ImageAssetDal';
import { locationDal } from '@/lib/dal/locationDal/LocationDal';
import { PRICE_TYPE } from '@/lib/types/PriceType';
import { AgeRestriction, EventCategory } from '@prisma/client';
import { expect } from '@jest/globals';
import { EventService } from '@/lib/services/eventService/eventService';
import ImageService from '@/lib/services/imageService/ImageService';

jest.mock('@/lib/dal/imageAssetDal/ImageAssetDal', () => ({
  imageAssetDal: {
    create: jest.fn().mockResolvedValue({ id: 'imageId' }),
  },
}));

jest.mock('@/lib/dal/locationDal/LocationDal', () => ({
  locationDal: {
    create: jest.fn().mockResolvedValue({ id: 'locationId' }),
  },
}));

jest.mock('@/lib/dal/eventDal/EventDal', () => ({
  eventDal: {
    create: jest.fn(),
  },
}));

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: {
    deleteByStoragePath: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('EventSrvice.createEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (imageAssetDal.create as jest.Mock).mockResolvedValue({ id: 'imageId' });
    (locationDal.create as jest.Mock).mockResolvedValue({ id: 'locationId' });
    (eventDal.create as jest.Mock).mockResolvedValue(undefined);
    (ImageService.deleteByStoragePath as jest.Mock).mockResolvedValue(undefined);
  });

  it('should create event with location', async () => {
    const authUser = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'firebaseUid',
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
        storagePath: 'events/firebaseUid/image.jpg',
        contentType: 'image/jpeg',
        sizeBytes: 1024,
        originalName: 'image.jpg',
      },
      category: EventCategory.SOCIAL,
      priceType: PRICE_TYPE.Free,
      tags: [],
    };

    await expect(EventService.createEvent(authUser, input)).resolves.not.toThrow();
    expect(eventDal.create).toHaveBeenCalledWith(
      expect.objectContaining({
        imageId: 'imageId',
        locationId: 'locationId',
      }),
      expect.anything()
    );
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    expect(imageAssetDal.create).toHaveBeenCalledWith(input.image, expect.anything());
    expect(locationDal.create).toHaveBeenCalledWith(input.location, expect.anything());
  });

  it('should create event without location', async () => {
    const authUser = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'firebaseUid',
    };
    const input = {
      eventName: 'Test Event',
      eventDescription: 'This is a test event',
      startDateTime: '2026-02-15T19:00:00-05:00[America/Toronto]',
      status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
      ageRestriction: AgeRestriction.ALL_AGES,
      image: {
        storagePath: 'events/firebaseUid/image.jpg',
        contentType: 'image/jpeg',
        sizeBytes: 1024,
        originalName: 'image.jpg',
      },
      category: EventCategory.SOCIAL,
      priceType: PRICE_TYPE.Free,
      tags: [],
    };

    await expect(EventService.createEvent(authUser, input)).resolves.not.toThrow();
    expect(eventDal.create).toHaveBeenCalledWith(
      expect.objectContaining({
        imageId: 'imageId',
        locationId: undefined,
      }),
      expect.anything()
    );
    expect(imageAssetDal.create).toHaveBeenCalledWith(input.image, expect.anything());
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('deletes image if event creation fails', async () => {
    const authUser = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'firebaseUid',
    };
    const input = {
      eventName: 'Test Event',
      eventDescription: 'This is a test event',
      startDateTime: '2026-02-15T19:00:00-05:00[America/Toronto]',
      status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
      ageRestriction: AgeRestriction.ALL_AGES,
      image: {
        storagePath: 'events/firebaseUid/image.jpg',
        contentType: 'image/jpeg',
        sizeBytes: 1024,
        originalName: 'image.jpg',
      },
      category: EventCategory.SOCIAL,
      priceType: PRICE_TYPE.Free,
      tags: [],
    };

    (eventDal.create as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    await expect(EventService.createEvent(authUser, input)).rejects.toThrow('DB error');
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith('events/firebaseUid/image.jpg');
  });

  it('errors on unauthenticated storage path', async () => {
    const authUser = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'firebaseUid',
    };
    const input = {
      eventName: 'Test Event',
      eventDescription: 'This is a test event',
      startDateTime: '2026-02-15T19:00:00-05:00[America/Toronto]',
      status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
      ageRestriction: AgeRestriction.ALL_AGES,
      image: {
        storagePath: 'events/otherUser/image.jpg', // Invalid path
        contentType: 'image/jpeg',
        sizeBytes: 1024,
        originalName: 'image.jpg',
      },
      category: EventCategory.SOCIAL,
      priceType: PRICE_TYPE.Free,
      tags: [],
    };

    await expect(EventService.createEvent(authUser, input)).rejects.toThrow('AUTH_UNAUTHORIZED');
    expect(eventDal.create).not.toHaveBeenCalled();
    expect(locationDal.create).not.toHaveBeenCalled();
    expect(imageAssetDal.create).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  })
  
});
