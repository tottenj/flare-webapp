import { eventDal } from '@/lib/dal/eventDal/EventDal';
import { imageAssetDal } from '@/lib/dal/imageAssetDal/ImageAssetDal';
import { locationDal } from '@/lib/dal/locationDal/LocationDal';
import { PRICE_TYPE } from '@/lib/types/PriceType';
import { AgeRestriction, EventCategory } from '@prisma/client';
import { expect } from '@jest/globals';
import { EventService } from '@/lib/services/eventService/eventService';
import ImageService from '@/lib/services/imageService/ImageService';
import { tagDal } from '@/lib/dal/tagDal/TagDal';
import { mapEventRowToDto } from '@/lib/types/dto/EventDto';
import { buildEventRow } from '@/lib/utils/tests/factories/eventRowFactory';
import tagService from '@/lib/services/tagService/tagService';
import { CreateEvent } from '@/lib/schemas/event/createEventFormSchema';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import { authOrgFactory } from '@/lib/utils/tests/factories/authOrgFactory';

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
    getEvent: jest.fn(),
    getUpcomingOrgEvent: jest.fn(),
  },
}));

jest.mock('@/lib/services/tagService/tagService', () => ({
  __esModule: true,
  default: {
    createAndIncrementMany: jest.fn(),
  },
}));

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: {
    deleteByStoragePath: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@/lib/types/dto/EventDto');

function eventServiceCreateFactory(overrides?: Partial<CreateEvent>): CreateEvent {
  const base: CreateEvent = {
    eventName: 'Test Event',
    eventDescription: 'This is a test event',
    startDateTime: '2026-02-15T19:00:00-05:00[America/Toronto]',
    status: 'PUBLISHED' as const,
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

  return {
    ...base,
    ...overrides,
    image: {
      ...base.image,
      ...overrides?.image,
    },
  };
}

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
    const input = eventServiceCreateFactory({"location":{placeId: "abc134", address:"address", lat:232, lng: 3232}});

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
    const input = eventServiceCreateFactory({ location: undefined });
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
    const input = eventServiceCreateFactory({ tags: ['tagOne', 'tagTwo', 'tagThree'] });
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
    const authUser = authOrgFactory();
    const input = eventServiceCreateFactory();
    (eventDal.create as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
    await expect(EventService.createEvent(authUser, input)).rejects.toThrow('DB error');
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith('events/firebaseUid/image.jpg');
  });

  it('errors on unauthenticated storage path', async () => {
    const authUser = authOrgFactory()
    const input = eventServiceCreateFactory({image:{storagePath:"events/otherUser/randoId/stock.jpeg"}})

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
