import { eventDal } from '@/lib/dal/eventDal/EventDal';
import { imageAssetDal } from '@/lib/dal/imageAssetDal/ImageAssetDal';
import { locationDal } from '@/lib/dal/locationDal/LocationDal';
import { expect } from '@jest/globals';
import { EventService } from '@/lib/services/eventService/eventService';
import ImageService from '@/lib/services/imageService/ImageService';
import { mapEventRowToDto } from '@/lib/types/dto/EventDto';
import { buildEventRow } from '../../../../__tests__/factories/dal/eventRow.builder';
import tagService from '@/lib/services/tagService/tagService';
import { eventInputFactory } from '../../../../__tests__/factories/service/eventInput.factory';
import { editEventInputFactory } from '../../../../__tests__/factories/service/editEventInput.factory';
import { authOrgFactory } from '../../../../__tests__/factories/auth/authOrg.factory';
import { prisma } from '../../../../prisma/prismaClient';
import { event } from 'cypress/types/jquery';

jest.mock('../../../../prisma/prismaClient', () => ({
  prisma: {
    $transaction: jest.fn(async (fn: any) => {
      const tx = {};
      return fn(tx);
    }),
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
  },
}));

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: {
    deleteByStoragePath: jest.fn().mockResolvedValue(undefined),
    getDownloadUrl: jest.fn(),
  },
}));

jest.mock('@/lib/types/dto/EventDto');

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

  it('errors on unauthenticated storage path', async () => {
    const authUser = authOrgFactory();
    const input = eventInputFactory({
      image: { storagePath: 'events/otherUser/randoId/stock.jpeg' },
    });

    await expect(EventService.createEvent(authUser, input)).rejects.toThrow('AUTH_UNAUTHORIZED');
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
    expect(eventDal.getUpcomingOrgEvent).toHaveBeenCalledWith(orgId);
    expect(mapEventRowToDto).toHaveBeenCalledWith(mockRow);
    expect(res).toEqual(mappedDto);
  });

  it('returns null if no event found', async () => {
    (eventDal.getUpcomingOrgEvent as jest.Mock).mockResolvedValue(null);
    const res = await EventService.getOrgUpcomingEvent(orgId);
    expect(eventDal.getUpcomingOrgEvent).toHaveBeenCalledWith(orgId);
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
    expect(eventDal.getUpcomingOrgEvent).toHaveBeenCalledWith(orgId);
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
    expect(eventDal.getUpcomingOrgEvent).toHaveBeenCalledWith(orgId);
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
    expect(eventDal.getUpcomingOrgEvent).toHaveBeenCalledWith(orgId);
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
    await expect(EventService.getEditData(eventId, actor)).rejects.toThrow('EVENT_NOT_FOUND');
    expect(eventDal.getEvent).toHaveBeenCalledWith(eventId);
    expect(eventDal.getEditData).toHaveBeenCalledWith(eventId);
    expect(mapEventRowToDto).not.toHaveBeenCalled();
    expect(ImageService.getDownloadUrl).not.toHaveBeenCalled();
    expect(locationDal.get).not.toHaveBeenCalled();
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

describe('eventService.editEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(EventService as any, 'assertCanEdit').mockResolvedValue(undefined);
  });

  it('successfully edits event', async () => {
    const eventId = 'eventId';
    const actor = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'uid',
    };
    const input = editEventInputFactory({
      image: { isNew: false, storagePath: 'events/uid/existing-image.jpg' },
      tags: ['drag', 'community'],
      location: {
        address: '123 Main St, Anytown, USA',
        placeId: 'place123',
        lat: 40.7128,
        lng: -74.006,
      },
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(
      buildEventRow({
        id: eventId,
        organizationId: actor.orgId,
        imageId: 'image-id',
        location: { placeId: 'place123', address: '123 Main St, Anytown, USA' },
      })
    );
    (tagService.createAndIncrementMany as jest.Mock).mockResolvedValueOnce([]);

    await expect(EventService.editEvent(eventId, actor, input)).resolves.not.toThrow();
    expect((EventService as any).assertCanEdit).toHaveBeenCalledWith(eventId, actor);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(tagService.createAndIncrementMany).toHaveBeenCalledWith([], expect.anything());
    expect(tagService.decrementMany).not.toHaveBeenCalled();
    expect(tagService.deleteUnused).not.toHaveBeenCalled();

    const editArgs = (eventDal.edit as jest.Mock).mock.calls[0][1];
    expect(editArgs.tags).toEqual(['id1', 'id2']);
    expect(editArgs.imageId).toBe('image-id');
    expect(editArgs.locationId).toBe('location-id');
    expect(eventDal.edit).toHaveBeenCalledTimes(1);
    expect(eventDal.edit).toHaveBeenCalledWith(eventId, editArgs, expect.anything());

    expect(imageAssetDal.create).not.toHaveBeenCalled();
    expect(locationDal.create).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('successfully edits event with new image', async () => {
    const eventId = 'eventId';
    const actor = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'uid',
    };
    const input = editEventInputFactory({
      image: { isNew: true, metadata: { storagePath: 'events/uid/new-image.jpg' } },
      tags: ['drag', 'community'],
      location: undefined,
    });

    const prevEvent = buildEventRow({
      id: eventId,
      organizationId: actor.orgId,
      imageId: 'image-id',
      location: { placeId: 'place-123', address: '123 Main St, Anytown, USA' },
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(prevEvent);

    (imageAssetDal.create as jest.Mock).mockResolvedValueOnce({ id: 'new-image-id' });
    (tagService.createAndIncrementMany as jest.Mock).mockResolvedValueOnce([]);

    await expect(EventService.editEvent(eventId, actor, input)).resolves.not.toThrow();

    if (!input.image.isNew) throw new Error('Image should be new in this test case');
    expect(imageAssetDal.create).toHaveBeenCalledWith(input.image.metadata, expect.anything());
    expect((EventService as any).assertCanEdit).toHaveBeenCalledWith(eventId, actor);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(tagService.createAndIncrementMany).toHaveBeenCalledWith([], expect.anything());
    expect(tagService.decrementMany).not.toHaveBeenCalled();
    expect(tagService.deleteUnused).not.toHaveBeenCalled();

    const editArgs = (eventDal.edit as jest.Mock).mock.calls[0][1];
    expect(editArgs.tags).toEqual(['id1', 'id2']);
    expect(editArgs.imageId).toBe('new-image-id');
    expect(editArgs.locationId).toBe('location-id');
    expect(eventDal.edit).toHaveBeenCalledTimes(1);
    expect(eventDal.edit).toHaveBeenCalledWith(eventId, editArgs, expect.anything());

    expect(locationDal.create).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith(prevEvent.image?.storagePath);
    expect(imageAssetDal.delete).toHaveBeenCalledWith(prevEvent.imageId, expect.anything());
  });

  it('successfully edits event with new location', async () => {
    const eventId = 'eventId';
    const actor = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'uid',
    };
    const input = editEventInputFactory({
      image: { isNew: false, storagePath: 'events/uid/existing-image.jpg' },
      tags: ['drag', 'community'],
      location: {
        address: '456 Elm St, Othertown, USA',
        placeId: 'place456',
        lat: 34.0522,
        lng: -118.2437,
      },
    });

    const prevEvent = buildEventRow({
      id: eventId,
      organizationId: actor.orgId,
      imageId: 'image-id',
      location: { placeId: 'place123', address: '123 Main St, Anytown, USA' },
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(prevEvent);
    (locationDal.create as jest.Mock).mockResolvedValueOnce({ id: 'new-location-id' });
    (tagService.createAndIncrementMany as jest.Mock).mockResolvedValueOnce([]);

    await expect(EventService.editEvent(eventId, actor, input)).resolves.not.toThrow();

    if (!input.location) throw new Error('Location should be defined in this test case');
    expect(locationDal.create).toHaveBeenCalledWith(input.location, expect.anything());
    expect((EventService as any).assertCanEdit).toHaveBeenCalledWith(eventId, actor);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(tagService.createAndIncrementMany).toHaveBeenCalledWith([], expect.anything());
    expect(tagService.decrementMany).not.toHaveBeenCalled();
    expect(tagService.deleteUnused).not.toHaveBeenCalled();

    const editArgs = (eventDal.edit as jest.Mock).mock.calls[0][1];
    expect(editArgs.tags).toEqual(['id1', 'id2']);
    expect(editArgs.imageId).toBe('image-id');
    expect(editArgs.locationId).toBe('new-location-id');
    expect(eventDal.edit).toHaveBeenCalledTimes(1);
    expect(eventDal.edit).toHaveBeenCalledWith(eventId, editArgs, expect.anything());

    expect(imageAssetDal.create).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('successfully edits event with new tags and deletes old tags', async () => {
    const eventId = 'eventId';
    const actor = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'uid',
    };
    const input = editEventInputFactory({
      image: { isNew: false, storagePath: 'events/uid/existing-image.jpg' },
      tags: ['drag', 'community', 'newtag'],
      location: null,
    });

    const prevEvent = buildEventRow({
      id: eventId,
      organizationId: actor.orgId,
      imageId: 'image-id',
      location: undefined,
      tags: [
        { tag: { id: 'id1', label: 'drag' } },
        { tag: { id: 'id2', label: 'community' } },
        { tag: { id: 'id3', label: 'oldtag' } },
      ],
    });

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(prevEvent);
    (tagService.createAndIncrementMany as jest.Mock).mockResolvedValueOnce(['id4']);
    (tagService.decrementMany as jest.Mock).mockResolvedValueOnce(undefined);
    (tagService.deleteUnused as jest.Mock).mockResolvedValueOnce(undefined);

    await expect(EventService.editEvent(eventId, actor, input)).resolves.not.toThrow();

    expect((EventService as any).assertCanEdit).toHaveBeenCalledWith(eventId, actor);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(tagService.createAndIncrementMany).toHaveBeenCalledWith(['newtag'], expect.anything());
    expect(tagService.decrementMany).toHaveBeenCalledWith(['id3'], expect.anything());
    expect(tagService.deleteUnused).toHaveBeenCalledWith(['id3'], expect.anything());

    const editArgs = (eventDal.edit as jest.Mock).mock.calls[0][1];
    expect(editArgs.tags).toEqual(['id1', 'id2', 'id4']);
    expect(editArgs.imageId).toBe('image-id');
    expect(editArgs.locationId).toBe('location-id');
    expect(eventDal.edit).toHaveBeenCalledTimes(1);
    expect(eventDal.edit).toHaveBeenCalledWith(eventId, editArgs, expect.anything());

    expect(imageAssetDal.create).not.toHaveBeenCalled();
    expect(locationDal.create).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('throws error if no event found with given id', async () => {
    const eventId = 'eventId';
    const actor = {
      userId: 'userId',
      orgId: 'orgId',
      firebaseUid: 'uid',
    };
    const input = editEventInputFactory();

    (eventDal.getEvent as jest.Mock).mockResolvedValueOnce(null);

    await expect(EventService.editEvent(eventId, actor, input)).rejects.toThrow('EVENT_NOT_FOUND');
    expect((EventService as any).assertCanEdit).toHaveBeenCalledWith(eventId, actor);
    expect(eventDal.getEvent).toHaveBeenCalledWith(eventId);
    expect(imageAssetDal.create).not.toHaveBeenCalled();
    expect(locationDal.create).not.toHaveBeenCalled();
    expect(tagService.createAndIncrementMany).not.toHaveBeenCalled();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    expect(eventDal.edit).not.toHaveBeenCalled();
  });
});
