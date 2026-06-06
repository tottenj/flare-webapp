import { eventDal } from '@/lib/dal/eventDal/EventDal';
import { imageAssetDal } from '@/lib/dal/imageAssetDal/ImageAssetDal';
import { locationDal } from '@/lib/dal/locationDal/LocationDal';
import { expect } from '@jest/globals';
import { EventService } from '@/lib/services/eventService/eventService';
import ImageService from '@/lib/services/imageService/ImageService';
import { mapEventRowToDto } from '@/lib/types/dto/event/EventDto';
import { buildEventRow } from '../../../../__tests__/factories/dal/eventRow.builder';
import tagService from '@/lib/services/tagService/tagService';
import { eventInputFactory } from '../../../../__tests__/factories/service/eventInput.factory';
import { editEventInputFactory } from '../../../../__tests__/factories/service/editEventInput.factory';
import { authOrgFactory } from '../../../../__tests__/factories/auth/authOrg.factory';

import { EventDomain } from '@/lib/domain/eventDomain/EventDomain';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/errors/AppError';

jest.mock('../../../../prisma/prismaClient', () => ({
  prisma: {
    $transaction: jest.fn(async (fn: any) => {
      const tx = {};
      return fn(tx);
    }),
  },
}));

jest.mock('@/lib/logger', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/lib/dal/imageAssetDal/ImageAssetDal', () => ({
  imageAssetDal: {
    create: jest.fn().mockResolvedValue({ id: 'imageId' }),
    delete: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@/lib/dal/locationDal/LocationDal', () => ({
  locationDal: {
    create: jest.fn().mockResolvedValue({ id: 'locationId' }),
    get: jest.fn(),
    getByPlaceId: jest.fn(),
  },
}));

jest.mock('@/lib/dal/eventDal/EventDal', () => ({
  eventDal: {
    create: jest.fn(),
    getEvent: jest.fn(),
    getUpcomingOrgEvent: jest.fn(),
    getOwnerInfo: jest.fn(),
    edit: jest.fn(),
    getEditData: jest.fn(),
  },
}));

jest.mock('@/lib/services/tagService/tagService', () => ({
  __esModule: true,
  default: {
    createAndIncrementMany: jest.fn(),
    decrementMany: jest.fn(),
    deleteUnused: jest.fn(),
    applyTagDiff: jest.fn(),
  },
}));

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: {
    deleteByStoragePath: jest.fn().mockResolvedValue(undefined),
    getDownloadUrl: jest.fn(),
  },
}));

jest.mock('@/lib/types/dto/event/EventDto');

(tagService.applyTagDiff as jest.Mock).mockImplementation(async (prevTags, newLabels, tx) => {
  const prevLabelSet = new Set(prevTags.map(({ tag }: any) => tag.label));
  const newLabelSet = new Set(newLabels);

  const toAdd = newLabels.filter((label: string) => !prevLabelSet.has(label));
  const toRemove = prevTags
    .filter(({ tag }: any) => !newLabelSet.has(tag.label))
    .map(({ tag }: any) => tag.id);

  const newTagIds = ((await (tagService.createAndIncrementMany as jest.Mock)(toAdd, tx)) ??
    []) as string[];

  if (toRemove.length > 0) {
    await (tagService.decrementMany as jest.Mock)(toRemove, tx);
    await (tagService.deleteUnused as jest.Mock)(toRemove, tx);
  }

  const remainingIds = prevTags
    .filter(({ tag }: any) => newLabelSet.has(tag.label))
    .map(({ tag }: any) => tag.id);

  return [...remainingIds, ...newTagIds];
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('EventService.createEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (imageAssetDal.create as jest.Mock).mockResolvedValue({ id: 'imageId' });
    (locationDal.create as jest.Mock).mockResolvedValue({ id: 'locationId' });
    (eventDal.create as jest.Mock).mockResolvedValue(undefined);
    (ImageService.deleteByStoragePath as jest.Mock).mockResolvedValue(undefined);
  });

  it('should create event with location', async () => {
    const authUser = authOrgFactory();
    const input = eventInputFactory({
      location: { placeId: 'abc134', address: 'address', lat: 232, lng: 3232 },
    });

    await expect(EventService.createEvent(authUser, input)).resolves.not.toThrow();
    expect(eventDal.create).toHaveBeenCalledWith(
      expect.objectContaining({
        imageId: 'imageId',
        locationId: 'locationId',
      }),
      expect.anything()
    );
    expect(tagService.createAndIncrementMany).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    expect(imageAssetDal.create).toHaveBeenCalledWith(input.image, expect.anything());
    expect(locationDal.create).toHaveBeenCalledWith(input.location, expect.anything());
  });

  it('should create event without location', async () => {
    const authUser = authOrgFactory();
    const input = eventInputFactory({ location: undefined });
    await expect(EventService.createEvent(authUser, input)).resolves.not.toThrow();
    expect(eventDal.create).toHaveBeenCalledWith(
      expect.objectContaining({
        imageId: 'imageId',
        locationId: undefined,
      }),
      expect.anything()
    );
    expect(locationDal.create).not.toHaveBeenCalled();
    expect(imageAssetDal.create).toHaveBeenCalledWith(input.image, expect.anything());
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('adds x number of tags to db', async () => {
    const authUser = authOrgFactory();
    const input = eventInputFactory({ tags: ['tagOne', 'tagTwo', 'tagThree'] });
    (tagService.createAndIncrementMany as jest.Mock).mockResolvedValueOnce(['id1', 'id2', 'id3']);
    await expect(EventService.createEvent(authUser, input)).resolves.not.toThrow();
    expect(eventDal.create).toHaveBeenCalledWith(
      expect.objectContaining({
        imageId: 'imageId',
        locationId: undefined,
        tags: ['id1', 'id2', 'id3'],
      }),
      expect.anything()
    );
    expect(tagService.createAndIncrementMany).toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('deletes image if event creation fails', async () => {
    const authUser = authOrgFactory({ firebaseUid: 'firebaseUid' });
    const input = eventInputFactory({ image: { storagePath: 'events/firebaseUid/image.jpg' } });
    (eventDal.create as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    await expect(EventService.createEvent(authUser, input)).rejects.toThrow('DB error');
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith('events/firebaseUid/image.jpg');
  });

  it('errors if user is not authorized to create event', async () => {
    const authUser = { userId: 'userId', firebaseUid: 'firebaseUid' };
    const input = eventInputFactory({ image: { storagePath: 'events/firebaseUid/image.jpg' } });
    await expect(EventService.createEvent(authUser as any, input)).rejects.toMatchObject({
      code: 'AUTH_UNAUTHORIZED',
    });
    expect(eventDal.create).not.toHaveBeenCalled();
    expect(locationDal.create).not.toHaveBeenCalled();
    expect(imageAssetDal.create).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('errors on unauthenticated storage path', async () => {
    const authUser = authOrgFactory();
    const input = eventInputFactory({
      image: { storagePath: 'events/otherUser/randoId/stock.jpeg' },
    });

    await expect(EventService.createEvent(authUser, input)).rejects.toMatchObject({
      code: 'AUTH_UNAUTHORIZED',
    });
    expect(eventDal.create).not.toHaveBeenCalled();
    expect(locationDal.create).not.toHaveBeenCalled();
    expect(imageAssetDal.create).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });
});

describe('EventService.getEventById', () => {
  const mockEventId = 'mockEventId';
  const mappedDto = { id: 'event-id-1' } as any;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully retrives the correct public event', async () => {
    const mockRow = buildEventRow({
      status: 'PUBLISHED',
      organization: {
        orgName: 'Test Org',
        status: 'VERIFIED',
      },
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(mockRow);
    (mapEventRowToDto as jest.Mock).mockReturnValueOnce(mappedDto);
    const res = await EventService.getEventById(mockEventId);
    expect(eventDal.getEvent).toHaveBeenCalledWith(mockEventId);
    expect(mapEventRowToDto).toHaveBeenCalledWith(mockRow);
    expect(res).toEqual(mappedDto);
  });

  it('successfully retrives draft event if isOwner', async () => {
    const mockEvent = buildEventRow({
      organizationId: 'orgId',
      status: 'DRAFT',
    });
    const mockActor = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'uid',
    };

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(mockEvent);
    (mapEventRowToDto as jest.Mock).mockReturnValueOnce(mappedDto);
    const res = await EventService.getEventById(mockEventId, mockActor);
    expect(eventDal.getEvent).toHaveBeenCalledWith(mockEventId);
    expect(mapEventRowToDto).toHaveBeenCalledWith(mockEvent);
    expect(res).toEqual(mappedDto);
  });

  it('returns null if event is draft and no actor is specified', async () => {
    const mockEvent = buildEventRow({
      organizationId: 'orgId',
      status: 'DRAFT',
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(mockEvent);
    (mapEventRowToDto as jest.Mock).mockReturnValueOnce(mappedDto);
    const res = await EventService.getEventById(mockEventId);
    expect(eventDal.getEvent).toHaveBeenCalledWith(mockEventId);
    expect(mapEventRowToDto).not.toHaveBeenCalled();
    expect(res).toBeNull();
  });

  it('returns null if event is draft and actor differs from ownder', async () => {
    const mockEvent = buildEventRow({
      organizationId: 'orgId',
      status: 'DRAFT',
    });
    const mockActor = {
      userId: 'userId',
      orgId: 'orgId2',
      firebaseUid: 'uid',
    };

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(mockEvent);
    (mapEventRowToDto as jest.Mock).mockReturnValueOnce(mappedDto);
    const res = await EventService.getEventById(mockEventId, mockActor);
    expect(eventDal.getEvent).toHaveBeenCalledWith(mockEventId);
    expect(mapEventRowToDto).not.toHaveBeenCalled();
    expect(res).toBeNull();
  });

  it('returns null if event is published and org is unverified', async () => {
    const mockEvent = buildEventRow({
      organizationId: 'orgId',
      status: 'PUBLISHED',
      organization: {
        orgName: 'name',
        status: 'PENDING',
      },
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(mockEvent);
    (mapEventRowToDto as jest.Mock).mockReturnValueOnce(mappedDto);
    const res = await EventService.getEventById(mockEventId);
    expect(eventDal.getEvent).toHaveBeenCalledWith(mockEventId);
    expect(mapEventRowToDto).not.toHaveBeenCalled();
    expect(res).toBeNull();
  });

  it('returns event if org is unverified but actor belongs to the org', async () => {
    const mockEvent = buildEventRow({
      organizationId: 'orgId',
      status: 'PUBLISHED',
      organization: {
        orgName: 'name',
        status: 'PENDING',
      },
    });
    const mockActor = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'uid',
    };

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(mockEvent);
    (mapEventRowToDto as jest.Mock).mockReturnValueOnce(mappedDto);
    const res = await EventService.getEventById(mockEventId, mockActor);
    expect(eventDal.getEvent).toHaveBeenCalledWith(mockEventId);
    expect(mapEventRowToDto).toHaveBeenCalledWith(mockEvent);
    expect(res).toEqual(mappedDto);
  });

  it('returns null if no event returned from getEvent', async () => {
    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(null);
    const res = await EventService.getEventById(mockEventId);
    expect(eventDal.getEvent).toHaveBeenCalledWith(mockEventId);
    expect(mapEventRowToDto).not.toHaveBeenCalled();
    expect(res).toBeNull();
  });
});

describe('EventService.getOrgUpcomingEvent', () => {
  const orgId = 'orgId';
  const mappedDto = { id: 'event-id-1' } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns verified org's event for public user", async () => {
    const mockRow = buildEventRow({
      organizationId: 'orgId',
      organization: {
        status: 'VERIFIED',
        orgName: 'name',
      },
    });
    (eventDal.getUpcomingOrgEvent as jest.Mock).mockResolvedValue(mockRow);
    (mapEventRowToDto as jest.Mock).mockReturnValue(mappedDto);
    const res = await EventService.getOrgUpcomingEvent(orgId);
    expect(eventDal.getUpcomingOrgEvent).toHaveBeenCalledWith(orgId, expect.any(Date));
    expect(mapEventRowToDto).toHaveBeenCalledWith(mockRow);
    expect(res).toEqual(mappedDto);
  });

  it('returns null if no event found', async () => {
    (eventDal.getUpcomingOrgEvent as jest.Mock).mockResolvedValue(null);
    const res = await EventService.getOrgUpcomingEvent(orgId);
    expect(eventDal.getUpcomingOrgEvent).toHaveBeenCalledWith(orgId, expect.any(Date));
    expect(mapEventRowToDto).not.toHaveBeenCalled();
    expect(res).toBeNull();
  });

  it('returns unverified orgs event if org is the actor', async () => {
    const mockRow = buildEventRow({
      organizationId: 'orgId',
      organization: {
        status: 'PENDING',
        orgName: 'name',
      },
    });
    const actor = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'uid',
    };

    (eventDal.getUpcomingOrgEvent as jest.Mock).mockResolvedValue(mockRow);
    (mapEventRowToDto as jest.Mock).mockReturnValue(mappedDto);
    const res = await EventService.getOrgUpcomingEvent(orgId, actor);
    expect(eventDal.getUpcomingOrgEvent).toHaveBeenCalledWith(orgId, expect.any(Date));
    expect(mapEventRowToDto).toHaveBeenCalledWith(mockRow);
    expect(res).toEqual(mappedDto);
  });

  it('returns null if org is unverified and no actor', async () => {
    const mockRow = buildEventRow({
      organizationId: 'orgId',
      organization: {
        status: 'PENDING',
        orgName: 'name',
      },
    });

    (eventDal.getUpcomingOrgEvent as jest.Mock).mockResolvedValue(mockRow);
    (mapEventRowToDto as jest.Mock).mockReturnValue(mappedDto);
    const res = await EventService.getOrgUpcomingEvent(orgId);
    expect(eventDal.getUpcomingOrgEvent).toHaveBeenCalledWith(orgId, expect.any(Date));
    expect(mapEventRowToDto).not.toHaveBeenCalled();
    expect(res).toBeNull();
  });

  it('returns null if org is unverified and actor org id does not match', async () => {
    const mockRow = buildEventRow({
      organizationId: 'orgId',
      organization: {
        status: 'PENDING',
        orgName: 'name',
      },
    });

    const actor = {
      userId: 'userId',
      orgId: 'orgId2',
      firebaseUid: 'uid',
    };

    (eventDal.getUpcomingOrgEvent as jest.Mock).mockResolvedValue(mockRow);
    (mapEventRowToDto as jest.Mock).mockReturnValue(mappedDto);
    const res = await EventService.getOrgUpcomingEvent(orgId, actor);
    expect(eventDal.getUpcomingOrgEvent).toHaveBeenCalledWith(orgId, expect.any(Date));
    expect(mapEventRowToDto).not.toHaveBeenCalled();
    expect(res).toBeNull();
  });
});

describe('EventService.getEditData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(EventService as any, 'assertCanEdit').mockResolvedValue(undefined);
  });

  it('successfully gets edit data', async () => {
    const eventId = 'eventId';
    const actor = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'uid',
    };
    const eventRow = buildEventRow({
      id: eventId,
      organizationId: actor.orgId,
      imageId: 'image-id',
      locationId: 'location-id',
    });
    const eventAssets = {
      image: {
        storagePath: 'events/uid/image.jpg',
        contentType: 'image/jpeg',
        sizeBytes: 1234,
        originalName: 'image.jpg',
      },
      locationId: 'location-id',
    };
    const location = {
      address: '123 Main St, Anytown, USA',
      placeId: 'place123',
      latitude: 40.7128,
      longitude: -74.006,
    };

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(eventRow);
    (eventDal.getEditData as jest.Mock).mockResolvedValueOnce(eventAssets);
    (ImageService.getDownloadUrl as jest.Mock).mockResolvedValueOnce(
      'https://example.com/image.jpg'
    );
    (locationDal.get as jest.Mock).mockResolvedValueOnce(location);

    const res = await EventService.getEditData(eventId, actor);
    const mappedEvent = (mapEventRowToDto as jest.Mock).mock.results[0]?.value;

    expect((EventService as any).assertCanEdit).toHaveBeenCalledWith(eventId, actor);
    expect(eventDal.getEvent).toHaveBeenCalledWith(eventId);
    expect(eventDal.getEditData).toHaveBeenCalledWith(eventId);
    expect(mapEventRowToDto).toHaveBeenCalledWith(eventRow);
    expect(ImageService.getDownloadUrl).toHaveBeenCalledWith(eventAssets.image.storagePath);
    expect(locationDal.get).toHaveBeenCalledWith(eventAssets.locationId);
    expect(res).toEqual({
      event: mappedEvent,
      imageUrl: 'https://example.com/image.jpg',
      location: {
        address: location.address,
        placeId: location.placeId,
        lat: location.latitude,
        lng: location.longitude,
      },
      imageMetadata: {
        contentType: eventAssets.image.contentType,
        sizeBytes: eventAssets.image.sizeBytes,
        storagePath: eventAssets.image.storagePath,
        originalName: eventAssets.image.originalName,
      },
    });
  });

  it('throws error if no event found', async () => {
    const eventId = 'eventId';
    const actor = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'uid',
    };
    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(null);
    await expect(EventService.getEditData(eventId, actor)).rejects.toMatchObject({
      code: 'EVENT_NOT_FOUND',
    });
    expect(eventDal.getEvent).toHaveBeenCalledWith(eventId);
    expect(eventDal.getEditData).toHaveBeenCalledWith(eventId);
    expect(mapEventRowToDto).not.toHaveBeenCalled();
    expect(ImageService.getDownloadUrl).not.toHaveBeenCalled();
    expect(locationDal.get).not.toHaveBeenCalled();
  });

  it('returns edit data with placeholder image when storage file is missing', async () => {
    const eventId = 'eventId';
    const actor = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'uid',
    };
    const eventRow = buildEventRow({
      id: eventId,
      organizationId: actor.orgId,
      imageId: 'image-id',
      locationId: 'location-id',
    });
    const eventAssets = {
      image: {
        storagePath: 'events/uid/missing.jpg',
        contentType: 'image/jpeg',
        sizeBytes: 1234,
        originalName: 'missing.jpg',
      },
      locationId: 'location-id',
    };
    const location = {
      address: '123 Main St, Anytown, USA',
      placeId: 'place123',
      latitude: 40.7128,
      longitude: -74.006,
    };

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(eventRow);
    (eventDal.getEditData as jest.Mock).mockResolvedValueOnce(eventAssets);
    (ImageService.getDownloadUrl as jest.Mock).mockRejectedValueOnce(
      new AppError({
        code: 'STORAGE_MISSING_PATH',
        clientMessage: 'No File Exists',
        status: 400,
      })
    );
    (locationDal.get as jest.Mock).mockResolvedValueOnce(location);

    const res = await EventService.getEditData(eventId, actor);

    expect(res.imageUrl).toBeUndefined();
    expect(res.imageMetadata?.storagePath).toBe(eventAssets.image.storagePath);
    expect(locationDal.get).toHaveBeenCalledWith(eventAssets.locationId);
    expect(logger.warn).toHaveBeenCalledWith(
      'EVENT_EDIT_IMAGE_MISSING',
      expect.objectContaining({
        eventId,
        storagePath: eventAssets.image.storagePath,
        errorCode: 'STORAGE_MISSING_PATH',
      })
    );
  });

  it("throws error if user can't edit image", async () => {
    const eventId = 'eventId';
    const actor = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'uid',
    };
    (EventService as any).assertCanEdit.mockRejectedValueOnce(new Error('Cannot edit event'));
    await expect(EventService.getEditData(eventId, actor)).rejects.toThrow('Cannot edit event');
    expect(eventDal.getEvent).not.toHaveBeenCalled();
    expect(eventDal.getEditData).not.toHaveBeenCalled();
    expect(mapEventRowToDto).not.toHaveBeenCalled();
    expect(ImageService.getDownloadUrl).not.toHaveBeenCalled();
    expect(locationDal.get).not.toHaveBeenCalled();
  });
});

describe('EventService.editEvent', () => {
  const cleanupUploadedImageOnFailure = jest.fn();
  const mockedEditProps = { title: 'Edited title from mocked domain' };
  let onEditSpy: jest.SpiedFunction<typeof EventDomain.onEdit>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(EventService as any, 'assertCanEdit').mockResolvedValue(undefined);
    (imageAssetDal.create as jest.Mock).mockResolvedValue({ id: 'newImageId' });
    (eventDal.edit as jest.Mock).mockResolvedValue(undefined);
    (cleanupUploadedImageOnFailure as jest.Mock).mockResolvedValue(undefined);
    onEditSpy = jest
      .spyOn(EventDomain, 'onEdit')
      .mockReturnValue({ props: mockedEditProps } as any);
  });

  it('successfully edits event', async () => {
    const actor = authOrgFactory({ orgId: 'orgId', firebaseUid: 'uid3' });
    const eventId = 'eventId';
    const newImageMetadata = {
      contentType: 'image/jpeg',
      sizeBytes: 555,
      originalName: 'replacement.jpg',
      storagePath: 'events/uid3/replacement.jpg',
    };
    const originalEvent = buildEventRow({
      id: eventId,
      organizationId: actor.orgId,
      imageId: 'old-image-id',
      image: { storagePath: 'events/uid3/old-image.jpg' },
      location: { placeId: 'old-place-id', address: 'Old address' },
      tags: [{ tag: { id: 'id1', label: 'drag' } }, { tag: { id: 'id2', label: 'community' } }],
    });

    const event = editEventInputFactory({
      startDateTime: '2026-01-01T00:00:00+00:00[UTC]',
      location: {
        placeId: 'new-place-id',
        address: '123 Updated St',
        lat: 44.1,
        lng: -79.2,
      },
      image: {
        isNew: true,
        metadata: newImageMetadata,
      },
      tags: ['tag1', 'tag2'],
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(originalEvent);
    (locationDal.create as jest.Mock).mockResolvedValueOnce({ id: 'new-location-id' });
    (tagService.applyTagDiff as jest.Mock).mockResolvedValueOnce(['tag-id-1', 'tag-id-2']);

    await EventService.editEvent(eventId, actor, event);

    expect((EventService as any).assertCanEdit).toHaveBeenCalledWith(eventId, actor);
    expect(eventDal.getEvent).toHaveBeenCalledWith(eventId);
    expect(imageAssetDal.create).toHaveBeenCalledWith(newImageMetadata, expect.anything());
    expect(imageAssetDal.delete).toHaveBeenCalledWith('old-image-id', expect.anything());
    expect(locationDal.create).toHaveBeenCalledWith(event.location, expect.anything());
    expect(tagService.applyTagDiff).toHaveBeenCalledWith(
      originalEvent.tags,
      event.tags,
      expect.anything()
    );
    expect(onEditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ...event,
        imageId: 'newImageId',
        locationId: 'new-location-id',
        tags: ['tag-id-1', 'tag-id-2'],
      }),
      expect.anything()
    );
    expect(eventDal.edit).toHaveBeenCalledWith(eventId, mockedEditProps, expect.anything());
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith('events/uid3/old-image.jpg');

    const tx = (eventDal.edit as jest.Mock).mock.calls[0][2];
    expect((imageAssetDal.create as jest.Mock).mock.calls[0][1]).toBe(tx);
    expect((imageAssetDal.delete as jest.Mock).mock.calls[0][1]).toBe(tx);
    expect((locationDal.create as jest.Mock).mock.calls[0][1]).toBe(tx);
    expect((tagService.applyTagDiff as jest.Mock).mock.calls[0][2]).toBe(tx);
  });

  it('successfully edits event without new image and location', async () => {
    const actor = authOrgFactory({ orgId: 'orgId', firebaseUid: 'uid3' });
    const eventId = 'eventId';

    const originalEvent = buildEventRow({
      id: eventId,
      organizationId: actor.orgId,
      imageId: 'old-image-id',
      image: { storagePath: 'events/uid3/old-image.jpg' },
      location: { placeId: 'old-place-id', address: 'Old address' },
      tags: [{ tag: { id: 'id1', label: 'drag' } }, { tag: { id: 'id2', label: 'community' } }],
    });

    const event = editEventInputFactory({
      startDateTime: '2026-01-01T00:00:00+00:00[UTC]',
      location: {
        placeId: originalEvent.location!.placeId,
        address: originalEvent.location!.address!,
        lat: 44.1,
        lng: -79.2,
      },
      image: {
        isNew: false,
        storagePath: 'events/uid3/old-image.jpg',
      },
      tags: ['tag1', 'tag2'],
    });
    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(originalEvent);
    (tagService.applyTagDiff as jest.Mock).mockResolvedValueOnce(['tag-id-1', 'tag-id-2']);

    await EventService.editEvent(eventId, actor, event);

    expect(imageAssetDal.create).not.toHaveBeenCalled();
    expect(locationDal.create).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    expect(onEditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ...event,
        imageId: undefined,
        locationId: undefined,
        tags: ['tag-id-1', 'tag-id-2'],
      }),
      expect.anything()
    );
    expect(eventDal.edit).toHaveBeenCalledWith(eventId, mockedEditProps, expect.anything());
  });

  it('throws and does not persist if domain validation fails', async () => {
    const actor = authOrgFactory({ orgId: 'orgId', firebaseUid: 'uid3' });
    const eventId = 'eventId';
    const newImageMetadata = {
      contentType: 'image/jpeg',
      sizeBytes: 555,
      originalName: 'replacement.jpg',
      storagePath: 'events/uid3/replacement.jpg',
    };
    const originalEvent = buildEventRow({
      id: eventId,
      organizationId: actor.orgId,
      imageId: 'old-image-id',
      image: { storagePath: 'events/uid3/old-image.jpg' },
      location: { placeId: 'old-place-id', address: 'Old address' },
      tags: [{ tag: { id: 'id1', label: 'drag' } }, { tag: { id: 'id2', label: 'community' } }],
    });

    const event = editEventInputFactory({
      startDateTime: '2026-01-01T00:00:00+00:00[UTC]',
      location: {
        placeId: 'new-place-id',
        address: '123 Updated St',
        lat: 44.1,
        lng: -79.2,
      },
      image: {
        isNew: true,
        metadata: newImageMetadata,
      },
      tags: ['tag1', 'tag2'],
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(originalEvent);
    (locationDal.create as jest.Mock).mockResolvedValueOnce({ id: 'new-location-id' });
    (tagService.applyTagDiff as jest.Mock).mockResolvedValueOnce(['tag-id-1', 'tag-id-2']);
    onEditSpy.mockImplementation(() => {
      throw new Error('Validation failed');
    });

    await expect(EventService.editEvent(eventId, actor, event)).rejects.toThrow(
      'Validation failed'
    );
    expect(imageAssetDal.create).toHaveBeenCalledWith(newImageMetadata, expect.anything());
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    expect(locationDal.create).toHaveBeenCalledWith(event.location, expect.anything());
    expect(tagService.applyTagDiff).toHaveBeenCalledWith(
      originalEvent.tags,
      event.tags,
      expect.anything()
    );
    expect(eventDal.edit).not.toHaveBeenCalled();
  });

  it("throws if user can't edit event", async () => {
    const actor = authOrgFactory({ orgId: 'orgId', firebaseUid: 'uid3' });
    const eventId = 'eventId';
    const event = editEventInputFactory();

    (EventService as any).assertCanEdit.mockRejectedValueOnce(new Error('Cannot edit event'));
    await expect(EventService.editEvent(eventId, actor, event)).rejects.toThrow(
      'Cannot edit event'
    );
    expect(eventDal.getEvent).not.toHaveBeenCalled();
    expect(imageAssetDal.create).not.toHaveBeenCalled();
    expect(locationDal.create).not.toHaveBeenCalled();
    expect(tagService.applyTagDiff).not.toHaveBeenCalled();
    expect(eventDal.edit).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('throws if event not found', async () => {
    const actor = authOrgFactory({ orgId: 'orgId', firebaseUid: 'uid3' });
    const eventId = 'eventId';
    const event = editEventInputFactory();

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(null);
    await expect(EventService.editEvent(eventId, actor, event)).rejects.toMatchObject({
      code: 'EVENT_NOT_FOUND',
    });
    expect(eventDal.getEvent).toHaveBeenCalledWith(eventId);
    expect(imageAssetDal.create).not.toHaveBeenCalled();
    expect(locationDal.create).not.toHaveBeenCalled();
    expect(tagService.applyTagDiff).not.toHaveBeenCalled();
    expect(eventDal.edit).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('throws error image storage path is unauthenticated and does not persist changes', async () => {
    const actor = authOrgFactory({ orgId: 'orgId', firebaseUid: 'uid3' });
    const eventId = 'eventId';
    const newImageMetadata = {
      contentType: 'image/jpeg',
      sizeBytes: 555,
      originalName: 'replacement.jpg',
      storagePath: 'events/otherUser/replacement.jpg',
    };
    const originalEvent = buildEventRow({
      id: eventId,
      organizationId: actor.orgId,
      imageId: 'old-image-id',
      image: { storagePath: 'events/uid3/old-image.jpg' },
      location: { placeId: 'old-place-id', address: 'Old address' },
      tags: [{ tag: { id: 'id1', label: 'drag' } }, { tag: { id: 'id2', label: 'community' } }],
    });

    const event = editEventInputFactory({
      startDateTime: '2026-01-01T00:00:00+00:00[UTC]',
      location: {
        placeId: 'new-place-id',
        address: '123 Updated St',
        lat: 44.1,
        lng: -79.2,
      },
      image: {
        isNew: true,
        metadata: newImageMetadata,
      },
      tags: ['tag1', 'tag2'],
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(originalEvent);
    await expect(EventService.editEvent(eventId, actor, event)).rejects.toMatchObject({
      code: 'AUTH_UNAUTHORIZED',
    });
    expect(imageAssetDal.create).not.toHaveBeenCalled();
    expect(locationDal.create).not.toHaveBeenCalled();
    expect(tagService.applyTagDiff).not.toHaveBeenCalled();
    expect(eventDal.edit).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('does not run delete if no old image exists', async () => {
    const actor = authOrgFactory({ orgId: 'orgId', firebaseUid: 'uid3' });
    const eventId = 'eventId';
    const newImageMetadata = {
      contentType: 'image/jpeg',
      sizeBytes: 555,
      originalName: 'replacement.jpg',
      storagePath: 'events/uid3/replacement.jpg',
    };
    const originalEvent = buildEventRow({
      id: eventId,
      organizationId: actor.orgId,
      imageId: null,
      image: null,
      location: { placeId: 'old-place-id', address: 'Old address' },
      tags: [{ tag: { id: 'id1', label: 'drag' } }, { tag: { id: 'id2', label: 'community' } }],
    });

    const event = editEventInputFactory({
      startDateTime: '2026-01-01T00:00:00+00:00[UTC]',
      location: {
        placeId: 'new-place-id',
        address: '123 Updated St',
        lat: 44.1,
        lng: -79.2,
      },
      image: {
        isNew: true,
        metadata: newImageMetadata,
      },
      tags: ['tag1', 'tag2'],
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(originalEvent);
    (locationDal.create as jest.Mock).mockResolvedValueOnce({ id: 'new-location-id' });
    (tagService.applyTagDiff as jest.Mock).mockResolvedValueOnce(['tag-id-1', 'tag-id-2']);

    await EventService.editEvent(eventId, actor, event);

    expect(imageAssetDal.create).toHaveBeenCalledWith(newImageMetadata, expect.anything());
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    expect(locationDal.create).toHaveBeenCalledWith(event.location, expect.anything());
    expect(tagService.applyTagDiff).toHaveBeenCalledWith(
      originalEvent.tags,
      event.tags,
      expect.anything()
    );
    expect(onEditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ...event,
        imageId: 'newImageId',
        locationId: 'new-location-id',
        tags: ['tag-id-1', 'tag-id-2'],
      }),
      expect.anything()
    );
    expect(eventDal.edit).toHaveBeenCalledWith(eventId, mockedEditProps, expect.anything());
  });

  it('omits tags if no tags provided in input', async () => {
    const actor = authOrgFactory({ orgId: 'orgId', firebaseUid: 'uid3' });
    const eventId = 'eventId';
    const originalEvent = buildEventRow({
      id: eventId,
      organizationId: actor.orgId,
      imageId: null,
      image: null,
      location: { placeId: 'old-place-id', address: 'Old address' },
      tags: [{ tag: { id: 'id1', label: 'drag' } }, { tag: { id: 'id2', label: 'community' } }],
    });

    const event = editEventInputFactory({
      startDateTime: '2026-01-01T00:00:00+00:00[UTC]',
      location: {
        placeId: 'new-place-id',
        address: '123 Updated St',
        lat: 44.1,
        lng: -79.2,
      },
      image: {
        isNew: false,
        storagePath: 'events/uid3/old-image.jpg',
      },
      tags: undefined,
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(originalEvent);
    (locationDal.create as jest.Mock).mockResolvedValueOnce({ id: 'new-location-id' });

    await EventService.editEvent(eventId, actor, event);

    expect(tagService.applyTagDiff).not.toHaveBeenCalled();
    expect(onEditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ...event,
        imageId: undefined,
        locationId: 'new-location-id',
        tags: undefined,
      }),
      expect.anything()
    );
    expect(eventDal.edit).toHaveBeenCalledWith(eventId, mockedEditProps, expect.anything());
  });

  it('omits image update if no new image provided in input', async () => {
    const actor = authOrgFactory({ orgId: 'orgId', firebaseUid: 'uid3' });
    const eventId = 'eventId';
    const originalEvent = buildEventRow({
      id: eventId,
      organizationId: actor.orgId,
      imageId: 'old-image-id',
      image: { storagePath: 'events/uid3/old-image.jpg' },
      location: { placeId: 'old-place-id', address: 'Old address' },
      tags: [{ tag: { id: 'id1', label: 'drag' } }, { tag: { id: 'id2', label: 'community' } }],
    });

    const event = editEventInputFactory({
      startDateTime: '2026-01-01T00:00:00+00:00[UTC]',
      location: {
        placeId: 'new-place-id',
        address: '123 Updated St',
        lat: 44.1,
        lng: -79.2,
      },
      image: undefined,
      tags: ['tag1', 'tag2'],
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(originalEvent);
    (locationDal.create as jest.Mock).mockResolvedValueOnce({ id: 'new-location-id' });
    (tagService.applyTagDiff as jest.Mock).mockResolvedValueOnce(['tag-id-1', 'tag-id-2']);

    await EventService.editEvent(eventId, actor, event);

    expect(imageAssetDal.create).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    expect(locationDal.create).toHaveBeenCalledWith(event.location, expect.anything());
    expect(tagService.applyTagDiff).toHaveBeenCalledWith(
      originalEvent.tags,
      event.tags,
      expect.anything()
    );
    expect(onEditSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        ...event,
        imageId: undefined,
        locationId: 'new-location-id',
        tags: ['tag-id-1', 'tag-id-2'],
      }),
      expect.anything()
    );
    expect(eventDal.edit).toHaveBeenCalledWith(eventId, mockedEditProps, expect.anything());
  });

  it('ensures storage delete error is swallowed and does not impact user experience', async () => {
    const actor = authOrgFactory({ orgId: 'orgId', firebaseUid: 'uid3' });
    const eventId = 'eventId';
    const newImageMetadata = {
      contentType: 'image/jpeg',
      sizeBytes: 555,
      originalName: 'replacement.jpg',
      storagePath: 'events/uid3/replacement.jpg',
    };
    const originalEvent = buildEventRow({
      id: eventId,
      organizationId: actor.orgId,
      imageId: 'old-image-id',
      image: { storagePath: 'events/uid3/old-image.jpg' },
      location: { placeId: 'old-place-id', address: 'Old address' },
      tags: [{ tag: { id: 'id1', label: 'drag' } }, { tag: { id: 'id2', label: 'community' } }],
    });

    const event = editEventInputFactory({
      startDateTime: '2026-01-01T00:00:00+00:00[UTC]',
      location: {
        placeId: 'new-place-id',
        address: '123 Updated St',
        lat: 44.1,
        lng: -79.2,
      },
      image: {
        isNew: true,
        metadata: newImageMetadata,
      },
      tags: ['tag1', 'tag2'],
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(originalEvent);
    (locationDal.create as jest.Mock).mockResolvedValueOnce({ id: 'new-location-id' });
    (tagService.applyTagDiff as jest.Mock).mockResolvedValueOnce(['tag-id-1', 'tag-id-2']);
    (ImageService.deleteByStoragePath as jest.Mock).mockRejectedValueOnce(
      new Error('Storage error')
    );

    await expect(EventService.editEvent(eventId, actor, event)).resolves.not.toThrow();
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith('events/uid3/old-image.jpg');
    expect(logger.error).toHaveBeenCalledWith(
      'STORAGE_DELETE_FAILED',
      expect.objectContaining({
        error: expect.any(Error),
        eventId,
        storagePath: 'events/uid3/old-image.jpg',
      })
    );
  });
});

describe('EventService.getPublicFilterData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully retrieves location data if placeid passed in', async () => {
    const filters = { placeId: 'placeId123' };
    const locationData = {
      placeId: 'placeId123',
      address: '123 Main St, Anytown, USA',
      latitude: 40.7128,
      longitude: -74.006,
    };

    const expectedData = {
      placeId: locationData.placeId,
      address: locationData.address,
      lat: locationData.latitude,
      lng: locationData.longitude,
    };

    (locationDal.getByPlaceId as jest.Mock).mockResolvedValueOnce(locationData);

    await expect(EventService.getPublicFilterData(filters)).resolves.toEqual({
      location: expectedData,
    });
    expect(locationDal.getByPlaceId).toHaveBeenCalledWith(filters.placeId);
  });

  it("returns null for location if placeid doesn't return data", () => {
    const filters = { placeId: 'placeId123' };

    (locationDal.getByPlaceId as jest.Mock).mockResolvedValueOnce(null);

    expect(EventService.getPublicFilterData(filters)).resolves.toEqual({
      location: null,
    });
    expect(locationDal.getByPlaceId).toHaveBeenCalled();
  });

  it('returns null for location if placeid not provided', () => {
    const filters = { placeId: undefined };

    expect(EventService.getPublicFilterData(filters)).resolves.toEqual({
      location: null,
    });
    expect(locationDal.getByPlaceId).not.toHaveBeenCalled();
  });
});
