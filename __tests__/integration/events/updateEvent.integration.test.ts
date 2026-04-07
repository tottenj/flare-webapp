import { EventService } from '@/lib/services/eventService/eventService';
import { expect } from '@jest/globals';
import ImageService from '@/lib/services/imageService/ImageService';
import { prisma } from '../../../prisma/prismaClient';
import { createAuthOrgIntegration } from '../../factories/integration/helpers/createAuthOrgIntegration';
import { eventInputFactory } from '../../factories/service/eventInput.factory';
import { editEventInputFactory } from '../../factories/service/editEventInput.factory';

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: {
    deleteByStoragePath: jest.fn(),
  },
}));

describe('EventService.editEvent (integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ImageService.deleteByStoragePath as jest.Mock).mockResolvedValue(undefined);
  });

  it('updates event fields, tags, image, and location', async () => {
    const { authUser, fakeOrg } = await createAuthOrgIntegration();
    const createInput = eventInputFactory(
      {
        eventName: 'Original Event',
        eventDescription: 'Original description',
        location: {
          placeId: 'original-place-id',
          address: '100 Original Rd',
          lat: 43.6532,
          lng: -79.3832,
        },
        tags: ['drag', 'community'],
      },
      authUser.firebaseUid
    );

    await EventService.createEvent(authUser, createInput);

    const existingEvent = await prisma.flareEvent.findFirst({
      where: {
        organizationId: fakeOrg.org.id,
        title: createInput.eventName,
      },
      include: {
        image: true,
        location: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    expect(existingEvent).not.toBeNull();
    if (!existingEvent) throw new Error('Expected existing event');

    const editInput = editEventInputFactory(
      {
        eventName: 'Updated Event',
        eventDescription: 'Updated description',
        startDateTime: '2031-05-10T20:30:00-04:00[America/Toronto]',
        image: {
          isNew: true,
          metadata: {
            storagePath: `events/${authUser.firebaseUid}/updated-image.jpg`,
            contentType: 'image/png',
            sizeBytes: 2048,
            originalName: 'updated-image.png',
          },
        },
        location: {
          placeId: 'updated-place-id',
          address: '200 Updated Ave',
          lat: 43.6426,
          lng: -79.3871,
        },
        tags: ['community', 'newtag'],
      },
      authUser.firebaseUid
    );

    await expect(
      EventService.editEvent(existingEvent.id, authUser, editInput)
    ).resolves.not.toThrow();

    const updatedEvent = await prisma.flareEvent.findUnique({
      where: { id: existingEvent.id },
      include: {
        image: true,
        location: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    expect(updatedEvent).not.toBeNull();
    if (!updatedEvent) throw new Error('Expected updated event');
    if (!editInput.image.isNew) throw new Error('Expected new image metadata');

    expect(updatedEvent.title).toBe(editInput.eventName);
    expect(updatedEvent.description).toBe(editInput.eventDescription);
    expect(updatedEvent.image?.storagePath).toBe(editInput.image.metadata.storagePath);
    expect(updatedEvent.image?.contentType).toBe(editInput.image.metadata.contentType);
    expect(updatedEvent.image?.sizeBytes).toBe(editInput.image.metadata.sizeBytes);
    expect(updatedEvent.image?.originalName).toBe(editInput.image.metadata.originalName);
    expect(updatedEvent.location?.placeId).toBe(editInput.location?.placeId);
    expect(updatedEvent.location?.address).toBe(editInput.location?.address);
    expect(updatedEvent.tags.map((eventTag) => eventTag.tag.label).sort()).toEqual([
      'community',
      'newtag',
    ]);

    const deletedOldImage = await prisma.imageAsset.findUnique({
      where: { id: existingEvent.imageId! },
    });
    expect(deletedOldImage).toBeNull();
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith(createInput.image.storagePath);

    const removedTag = await prisma.tag.findUnique({
      where: { label: 'drag' },
    });
    expect(removedTag).toBeNull();
  });

  it('throws unauthorized when actor does not own the event', async () => {
    const owner = await createAuthOrgIntegration();
    const otherOrg = await createAuthOrgIntegration();
    const createInput = eventInputFactory(
      {
        eventName: 'Owner Event',
        location: {
          placeId: 'owner-place-id',
          address: '300 Owner St',
          lat: 43.66,
          lng: -79.39,
        },
      },
      owner.authUser.firebaseUid
    );

    await EventService.createEvent(owner.authUser, createInput);

    const existingEvent = await prisma.flareEvent.findFirst({
      where: {
        organizationId: owner.fakeOrg.org.id,
        title: createInput.eventName,
      },
      include: {
        image: true,
      },
    });

    expect(existingEvent).not.toBeNull();
    if (!existingEvent) throw new Error('Expected existing event');

    const editInput = editEventInputFactory({}, otherOrg.authUser.firebaseUid);

    await expect(
      EventService.editEvent(existingEvent.id, otherOrg.authUser, editInput)
    ).rejects.toThrow('AUTH_UNAUTHORIZED');

    const unchangedEvent = await prisma.flareEvent.findUnique({
      where: { id: existingEvent.id },
      include: {
        image: true,
      },
    });

    expect(unchangedEvent?.title).toBe(createInput.eventName);
    expect(unchangedEvent?.image?.storagePath).toBe(createInput.image.storagePath);
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('throws if event does not exist', async () => {
    const { authUser } = await createAuthOrgIntegration();
    const editInput = editEventInputFactory({}, authUser.firebaseUid);

    await expect(EventService.editEvent('missing-event-id', authUser, editInput)).rejects.toThrow(
      'EVENT_NOT_FOUND'
    );
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });
});
