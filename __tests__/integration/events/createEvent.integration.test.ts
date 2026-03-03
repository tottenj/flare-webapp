import ImageService from '@/lib/services/imageService/ImageService';
import { resetTestDb } from '../../utils/restTestDb';
import { EventService } from '@/lib/services/eventService/eventService';
import { expect } from '@jest/globals';
import { imageAssetDal } from '@/lib/dal/imageAssetDal/ImageAssetDal';
import { eventRowInclude } from '@/lib/types/dto/EventDto';
import { authOrgFactory } from '../../factories/auth/authOrg.factory';
import { eventInputFactory } from '../../factories/service/eventInput.factory';
import { createOrgIntegration } from '../../factories/integration/org.factory';
import { createAuthOrgIntegration } from '../../factories/integration/helpers/createAuthOrgIntegration';

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
  });

  it('successfully creates event with valid data', async () => {
    const { fakeOrg, authUser } = await createAuthOrgIntegration();
    const input = eventInputFactory({}, authUser.firebaseUid);
    await expect(EventService.createEvent(authUser, input)).resolves.not.toThrow();
    const event = await prisma.flareEvent.findFirst({
      where: { organizationId: fakeOrg.org.id, title: input.eventName },
      include: eventRowInclude,
    });
    expect(event).toBeTruthy();
    expect(event?.title).toBe(input.eventName);
    expect(event?.location?.address).toBe(input.location?.address);
    expect(event?.image?.storagePath).toBe(input.image.storagePath);
    expect(event?.tags.length).toBe(0);
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('successfully creates event with tags and adds tags to relation', async () => {
    const { fakeOrg, authUser } = await createAuthOrgIntegration();
    const input = eventInputFactory(
      {
        tags: ['tag1', 'tag2', 'tag3'],
        eventName: 'event with tags',
      },
      authUser.firebaseUid
    );
    await expect(EventService.createEvent(authUser, input)).resolves.not.toThrow();
    const event = await prisma.flareEvent.findFirst({
      where: { organizationId: fakeOrg.org.id, title: input.eventName },
      include: eventRowInclude,
    });
    expect(event).toBeTruthy();
    expect(event?.title).toBe(input.eventName);
    expect(event?.tags.length).toBe(3);
    expect(event?.tags.map((t) => t.tag.label).sort()).toEqual(['tag1', 'tag2', 'tag3']);
  });

  it('successfully creates event without location', async () => {
    const { fakeOrg, authUser } = await createAuthOrgIntegration();
    const input = eventInputFactory(
      {
        location: undefined,
        eventName: 'Test Event No Location',
      },
      authUser.firebaseUid
    );
    await expect(EventService.createEvent(authUser, input)).resolves.not.toThrow();
    const event = await prisma.flareEvent.findFirst({
      where: { organizationId: fakeOrg.org.id, title: input.eventName },
      include: eventRowInclude,
    });
    expect(event).toBeTruthy();
    expect(event?.title).toBe(input.eventName);
    expect(event?.location).toBeNull();
    expect(event?.image?.storagePath).toBe(input.image.storagePath);
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('correctly stores and formats range money', async () => {
    const { fakeOrg, authUser } = await createAuthOrgIntegration();
    const input = eventInputFactory(
      {
        priceType: 'RANGE',
        minPrice: 10,
        maxPrice: 20,
        eventName: 'range price type',
      },
      authUser.firebaseUid
    );

    await expect(EventService.createEvent(authUser, input)).resolves.not.toThrow();
    const event = await prisma.flareEvent.findFirst({
      where: { organizationId: fakeOrg.org.id, title: input.eventName },
      include: eventRowInclude,
    });
    expect(event).toBeTruthy();
    expect(event?.title).toBe(input.eventName);
    expect(event?.pricingType).toBe(input.priceType);
    expect(event?.minPriceCents).toBe(1000);
    expect(event?.maxPriceCents).toBe(2000);
  });

  it('correctly stores and formats fixed money', async () => {
    const { fakeOrg, authUser } = await createAuthOrgIntegration();
    const input = eventInputFactory(
      {
        priceType: 'FIXED',
        minPrice: 10,
        eventName: 'fixed price type',
      },
      authUser.firebaseUid
    );

    await expect(EventService.createEvent(authUser, input)).resolves.not.toThrow();
    const event = await prisma.flareEvent.findFirst({
      where: { organizationId: fakeOrg.org.id, title: input.eventName },
      include: eventRowInclude,
    });
    expect(event).toBeTruthy();
    expect(event?.title).toBe(input.eventName);
    expect(event?.pricingType).toBe(input.priceType);
    expect(event?.minPriceCents).toBe(1000);
    expect(event?.maxPriceCents).toBeNull();
  });

  it('rejects invalid range price', async () => {
    const { fakeOrg, authUser } = await createAuthOrgIntegration();
    const input = eventInputFactory(
      {
        priceType: 'RANGE',
        minPrice: 20,
        maxPrice: 10,
      },
      authUser.firebaseUid
    );

    await expect(EventService.createEvent(authUser, input)).rejects.toThrow();
  });

  it('throws error and deletes image if event creation fails', async () => {
    const { fakeOrg, authUser } = await createAuthOrgIntegration();
    const input = eventInputFactory(
      {
        eventName: 'Test Event Error',
      },
      authUser.firebaseUid
    );
    // Mock the DAL to throw an error when trying to create the event
    jest.spyOn(imageAssetDal, 'create').mockRejectedValueOnce(new Error('DB error'));
    await expect(EventService.createEvent(authUser, input)).rejects.toThrow('DB error');
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith(input.image.storagePath);
    const event = await prisma.flareEvent.findFirst({
      where: { organizationId: fakeOrg.org.id, title: input.eventName },
    });
    expect(event).toBeNull();
  });

  it('throws error if image storage path is invalid', async () => {
    const { fakeOrg, authUser } = await createAuthOrgIntegration();
    const input = eventInputFactory({
      image: { storagePath: 'invalid-path/image.jpg' },
      eventName: 'Test Event Invalid Image Path',
    });
    await expect(EventService.createEvent(authUser, input)).rejects.toThrow('AUTH_UNAUTHORIZED');
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    const event = await prisma.flareEvent.findFirst({
      where: { organizationId: fakeOrg.org.id, title: input.eventName },
    });
    expect(event).toBeNull();
  });
});
