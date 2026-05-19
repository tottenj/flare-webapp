import { expect } from '@jest/globals';
import ImageService from '@/lib/services/imageService/ImageService';
import { createEventIntegration } from '../../factories/integration/event.factory';
import { createImageIntegration } from '../../factories/integration/image.factory';
import { createAuthOrgIntegration } from '../../factories/integration/helpers/createAuthOrgIntegration';
import { EventService } from '@/lib/services/eventService/eventService';
import { editEventInputFactory } from '../../factories/service/editEventInput.factory';
import { eventRowInclude } from '@/lib/types/dto/EventDto';

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: {
    deleteByStoragePath: jest.fn(),
  },
}));

describe('Edit Event Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ImageService.deleteByStoragePath as jest.Mock).mockResolvedValue(undefined);
  });

  it('successfully edits event with valid data', async () => {
    const { fakeOrg, authUser } = await createAuthOrgIntegration();
    const originalEvent = await createEventIntegration({ organizationId: fakeOrg.org.id });
    const updateData = editEventInputFactory(
      { eventName: 'Updated Name', eventDescription: 'Updated description' },
      authUser.firebaseUid
    );

    await expect(
      EventService.editEvent(originalEvent.id, authUser, updateData)
    ).resolves.not.toThrow();

    const updated = await prisma.flareEvent.findUnique({
      where: { id: originalEvent.id },
      include: eventRowInclude,
    });
    expect(updated?.title).toBe('Updated Name');
    expect(updated?.description).toBe('Updated description');
  });

  it('successfully updates location when placeId changes', async () => {
    const { fakeOrg, authUser } = await createAuthOrgIntegration();
    const originalEvent = await createEventIntegration({ organizationId: fakeOrg.org.id });
    const updateData = editEventInputFactory(
      {
        location: {
          placeId: 'new-place-id',
          address: '456 New St',
          lat: 43.6,
          lng: -79.4,
        },
      },
      authUser.firebaseUid
    );

    await EventService.editEvent(originalEvent.id, authUser, updateData);

    const updated = await prisma.flareEvent.findUnique({
      where: { id: originalEvent.id },
      include: eventRowInclude,
    });
    expect(updated?.location?.placeId).toBe('new-place-id');
    expect(updated?.location?.address).toBe('456 New St');
  });

  it('successfully assigns a new image and schedules old image deletion', async () => {
    const { fakeOrg, authUser } = await createAuthOrgIntegration();
    const oldImage = await createImageIntegration({
      storagePath: `events/${authUser.firebaseUid}/old-image.jpg`,
    });
    const originalEvent = await createEventIntegration({
      organizationId: fakeOrg.org.id,
      overrides: { image: { connect: { id: oldImage.id } } },
    });
    const newStoragePath = `events/${authUser.firebaseUid}/new-image.jpg`;
    const updateData = editEventInputFactory(
      {
        image: {
          isNew: true,
          metadata: {
            storagePath: newStoragePath,
            contentType: 'image/jpeg',
            sizeBytes: 2048,
            originalName: 'new-image.jpg',
          },
        },
      },
      authUser.firebaseUid
    );

    await EventService.editEvent(originalEvent.id, authUser, updateData);

    const updated = await prisma.flareEvent.findUnique({
      where: { id: originalEvent.id },
      include: eventRowInclude,
    });
    expect(updated?.image?.storagePath).toBe(newStoragePath);
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith(
      `events/${authUser.firebaseUid}/old-image.jpg`
    );
  });

  it('successfully updates tags', async () => {
    const { fakeOrg, authUser } = await createAuthOrgIntegration();
    const originalEvent = await createEventIntegration({ organizationId: fakeOrg.org.id });
    const updateData = editEventInputFactory(
      { tags: ['jazz', 'outdoor', 'family'] },
      authUser.firebaseUid
    );

    await EventService.editEvent(originalEvent.id, authUser, updateData);

    const updated = await prisma.flareEvent.findUnique({
      where: { id: originalEvent.id },
      include: eventRowInclude,
    });
    expect(updated?.tags.map((t) => t.tag.label).sort()).toEqual(['family', 'jazz', 'outdoor']);
  });

  it('throws AUTH_UNAUTHORIZED when actor does not own the event', async () => {
    const { fakeOrg } = await createAuthOrgIntegration();
    const { authUser: otherUser } = await createAuthOrgIntegration();
    const originalEvent = await createEventIntegration({ organizationId: fakeOrg.org.id });
    const updateData = editEventInputFactory({}, otherUser.firebaseUid);

    await expect(
      EventService.editEvent(originalEvent.id, otherUser, updateData)
    ).rejects.toMatchObject({
      code: 'AUTH_UNAUTHORIZED',
    });
  });

  it('throws EVENT_NOT_FOUND when event does not exist', async () => {
    const { authUser } = await createAuthOrgIntegration();
    const updateData = editEventInputFactory({}, authUser.firebaseUid);

    await expect(
      EventService.editEvent('non-existent-id', authUser, updateData)
    ).rejects.toMatchObject({ code: 'EVENT_NOT_FOUND' });
  });
});
