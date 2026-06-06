import { EventService } from '@/lib/services/eventService/eventService';
import ImageService from '@/lib/services/imageService/ImageService';
import { createEventIntegration } from '../../factories/integration/event.factory';
import { createOrgIntegration } from '../../factories/integration/org.factory';
import { expect } from '@jest/globals';
import { authOrgFactory } from '../../factories/auth/authOrg.factory';
import { createAuthOrgIntegration } from '../../factories/integration/helpers/createAuthOrgIntegration';
import { EventStatus } from '#prisma/generated/enums';
import { OrgEventFilter } from '@/lib/types/OrgEventFilter';
import { prisma } from '../../../prisma/prismaClient';
import { eventInputFactory } from '../../factories/service/eventInput.factory';
import { expectOnlyEventIds } from './filterAssertions';
import { createLocationIntegration } from '../../factories/integration/location.factory';

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: {
    getDownloadUrl: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  (ImageService.getDownloadUrl as jest.Mock).mockResolvedValue('https://example.com/image.jpg');
});

describe('EventService.getOrgUpcomingEvent (integration)', () => {
  it('returns upcoming event when org is verified', async () => {
    const { org } = await createOrgIntegration({ org: { status: 'VERIFIED' } });
    const event = await createEventIntegration({
      organizationId: org.id,
    });
    const result = await EventService.getOrgUpcomingEvent(org.id);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(event.id);
    expect(result?.organization.name).toBe(org.orgName);
  });

  it('returns event if actor owns org even if org is unverified', async () => {
    const { org, user } = await createOrgIntegration({ org: { status: 'PENDING' } });
    const event = await createEventIntegration({
      organizationId: org.id,
    });
    const actor = authOrgFactory({
      orgId: org.id,
      firebaseUid: user.firebaseUid,
      userId: user.id,
    });
    const result = await EventService.getOrgUpcomingEvent(org.id, actor);
    expect(result).not.toBeNull();
    expect(result?.id).toBe(event.id);
    expect(result?.organization.name).toBe(org.orgName);
  });

  it('returns null if org not verified and actor not owner', async () => {
    const { org } = await createOrgIntegration({
      org: { status: 'PENDING' },
    });
    await createEventIntegration({
      organizationId: org.id,
    });
    const result = await EventService.getOrgUpcomingEvent(org.id);
    expect(result).toBeNull();
  });

  it('ignores draft events', async () => {
    const { org } = await createOrgIntegration({
      org: { status: 'VERIFIED' },
    });
    await createEventIntegration({
      organizationId: org.id,
      overrides: {
        status: 'DRAFT',
      },
    });
    const result = await EventService.getOrgUpcomingEvent(org.id);
    expect(result).toBeNull();
  });

  it('does not return past events', async () => {
    const { org } = await createOrgIntegration({
      org: { status: 'VERIFIED' },
    });
    await createEventIntegration({
      organizationId: org.id,
      overrides: {
        startsAtUTC: new Date(Date.now() - 1000 * 60 * 60),
      },
    });
    const result = await EventService.getOrgUpcomingEvent(org.id);
    expect(result).toBeNull();
  });

  it('returns earliest upcoming event', async () => {
    const { org } = await createOrgIntegration({
      org: { status: 'VERIFIED' },
    });

    const later = await createEventIntegration({
      organizationId: org.id,
      overrides: {
        startsAtUTC: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        title: 'Later',
      },
    });

    const sooner = await createEventIntegration({
      organizationId: org.id,
      overrides: {
        startsAtUTC: new Date(Date.now() + 1000 * 60 * 60 * 24),
        title: 'Sooner',
      },
    });
    const result = await EventService.getOrgUpcomingEvent(org.id);
    expect(result?.id).toBe(sooner.id);
  });
});

describe('EventService.getEventById', () => {
  it('returns published event for public viewer when org is verified', async () => {
    const org = await createOrgIntegration();
    const event = await createEventIntegration({
      organizationId: org.org.id,
    });
    const res = await EventService.getEventById(event.id);
    expect(res).not.toBeNull();
    expect(res?.id).toBe(event.id);
    expect(res?.organization.name).toBe(org.org.orgName);
  });

  it('returns draft event to owner', async () => {
    const org = await createAuthOrgIntegration();
    const event = await createEventIntegration({
      organizationId: org.authUser.orgId,
    });
    const res = await EventService.getEventById(event.id, org.authUser);
    expect(res).not.toBeNull();
    expect(res?.id).toBe(event.id);
    expect(res?.organization.name).toBe(org.fakeOrg.org.orgName);
  });

  it('Returns null if org is not verified', async () => {
    const org = await createOrgIntegration({
      org: {
        status: 'PENDING',
      },
    });
    const event = await createEventIntegration({
      organizationId: org.org.id,
    });

    const res = await EventService.getEventById(event.id);
    expect(res).toBeNull();
  });

  it('Returns null if event is not published', async () => {
    const org = await createAuthOrgIntegration();
    const event = await createEventIntegration({
      organizationId: org.authUser.orgId,
      overrides: {
        status: 'DRAFT',
      },
    });
    expect(await EventService.getEventById(event.id)).toBeNull();
  });

  it('returns null when non-owner tries to view draft event', async () => {
    const org = await createAuthOrgIntegration();
    const org2 = await createAuthOrgIntegration();
    const event = await createEventIntegration({
      organizationId: org.authUser.orgId,
      overrides: {
        status: 'DRAFT',
      },
    });

    expect(await EventService.getEventById(event.id, org2.authUser)).toBeNull();
  });

  it('Returns null if event is published but org is not verified', async () => {
    const org = await createOrgIntegration({
      org: { status: 'PENDING' },
    });

    const event = await createEventIntegration({
      organizationId: org.org.id,
    });

    const res = await EventService.getEventById(event.id);

    expect(res).toBeNull();
  });
});

describe('EventService.listEventsOrg (integration)', () => {
  it('Fetches orgs events', async () => {
    const org = await createAuthOrgIntegration();
    const { orgId } = org.authUser;
    await createEventIntegration({ organizationId: orgId });
    await createEventIntegration({ organizationId: orgId });
    const res = await EventService.listEventsOrg(org.authUser);
    expect(res.length).toBe(2);
  });

  it('Filters events by status', async () => {
    const org = await createAuthOrgIntegration();
    const { orgId } = org.authUser;

    const tests: EventStatus[] = ['DRAFT', 'DRAFT', 'PUBLISHED'];
    const filters: OrgEventFilter = { status: 'DRAFT' };

    const expectedIds: string[] = [];

    await Promise.all(
      tests.map(async (stat) => {
        const event = await createEventIntegration({
          organizationId: orgId,
          overrides: { status: stat },
        });

        if (stat === 'DRAFT') {
          expectedIds.push(event.id);
        }
      })
    );
    const res = await EventService.listEventsOrg(org.authUser, filters);
    expect(res.length).toBe(expectedIds.length);
    const ids = res.map((e) => e.id);
    expect(ids).toEqual(expect.arrayContaining(expectedIds));
  });

  it('returns events sorted by start date', async () => {
    const org = await createAuthOrgIntegration();
    const early = await createEventIntegration({
      organizationId: org.authUser.orgId,
      overrides: {
        startsAtUTC: new Date('2026-01-01'),
      },
    });
    const late = await createEventIntegration({
      organizationId: org.authUser.orgId,
      overrides: {
        startsAtUTC: new Date('2026-02-01'),
      },
    });
    const events = await EventService.listEventsOrg(org.authUser);
    expect(events[0].id).toBe(early.id);
    expect(events[1].id).toBe(late.id);
  });
});

describe('EventService.listEventsUser category filter (integration)', () => {
  it('returns only events matching selected category from verified orgs', async () => {
    const { org } = await createOrgIntegration({ org: { status: 'VERIFIED' } });

    const nightlifeEvent = await createEventIntegration({
      organizationId: org.id,
      overrides: {
        category: 'NIGHTLIFE',
        title: 'Nightlife Result',
      },
    });

    await createEventIntegration({
      organizationId: org.id,
      overrides: {
        category: 'SOCIAL',
        title: 'Social Non Match',
      },
    });

    const results = await EventService.listEventsUser({ category: 'NIGHTLIFE' });

    expectOnlyEventIds(results, [nightlifeEvent.id]);
  });

  it('excludes matching-category events from unverified orgs', async () => {
    const verified = await createOrgIntegration({ org: { status: 'VERIFIED' } });
    const pending = await createOrgIntegration({ org: { status: 'PENDING' } });

    const verifiedEvent = await createEventIntegration({
      organizationId: verified.org.id,
      overrides: {
        category: 'NIGHTLIFE',
        title: 'Verified Nightlife Event',
      },
    });

    await createEventIntegration({
      organizationId: pending.org.id,
      overrides: {
        category: 'NIGHTLIFE',
        title: 'Pending Org Nightlife Event',
      },
    });

    const results = await EventService.listEventsUser({ category: 'NIGHTLIFE' });

    expectOnlyEventIds(results, [verifiedEvent.id]);
  });
});

describe('EventService.listEventsUser location filter (integration)', () => {
  it('returns only events within requested distance of selected place', async () => {
    const { org } = await createOrgIntegration({ org: { status: 'VERIFIED' } });

    const searchLocation = await createLocationIntegration({
      placeId: 'search-place-id-location-filter',
      address: 'Search Centre',
      lat: 43.6777,
      lng: -79.6248,
    });

    const nearbyLocation = await createLocationIntegration({
      placeId: 'nearby-place-id-location-filter',
      address: 'Nearby Result',
      lat: 43.685,
      lng: -79.61,
    });

    const farLocation = await createLocationIntegration({
      placeId: 'far-place-id-location-filter',
      address: 'Far Result',
      lat: 43.95,
      lng: -79.2,
    });

    const nearbyEvent = await createEventIntegration({
      organizationId: org.id,
      overrides: {
        title: 'Nearby Event Match',
        location: {
          connect: { id: nearbyLocation.id },
        },
      },
    });

    await createEventIntegration({
      organizationId: org.id,
      overrides: {
        title: 'Far Event Non Match',
        location: {
          connect: { id: farLocation.id },
        },
      },
    });

    const results = await EventService.listEventsUser({
      placeId: searchLocation.placeId as string,
      distance: 10,
    });

    expectOnlyEventIds(results, [nearbyEvent.id]);
  });
});

describe('EventService.getPublicFilterData (integration)', () => {
  it('returns mapped location data when placeId exists', async () => {
    const location = await createLocationIntegration({
      placeId: 'public-filter-place-id',
      address: '123 Filter Data St',
      lat: 43.7001,
      lng: -79.4163,
    });

    const result = await EventService.getPublicFilterData({
      placeId: location.placeId as string,
    });

    expect(result).toEqual({
      location: {
        placeId: location.placeId,
        address: location.address,
        lat: 43.7001,
        lng: -79.4163,
      },
    });
  });

  it('returns null location when placeId is missing or unknown', async () => {
    const noPlaceId = await EventService.getPublicFilterData({ placeId: undefined });
    expect(noPlaceId).toEqual({ location: null });

    const unknownPlaceId = await EventService.getPublicFilterData({
      placeId: 'non-existent-public-filter-place-id',
    });
    expect(unknownPlaceId).toEqual({ location: null });
  });
});

describe('EventService.getEditData (integration)', () => {
  it('returns edit data with event, image metadata, and location for owner', async () => {
    const { authUser, fakeOrg } = await createAuthOrgIntegration();
    const input = eventInputFactory(
      {
        eventName: 'Editable Event',
        location: {
          placeId: 'edit-place-id',
          address: '123 Edit St',
          lat: 43.7001,
          lng: -79.4163,
        },
        tags: ['drag', 'community'],
      },
      authUser.firebaseUid
    );

    await EventService.createEvent(authUser, input);

    const createdEvent = await prisma.flareEvent.findFirst({
      where: {
        organizationId: fakeOrg.org.id,
        title: input.eventName,
      },
      include: {
        image: true,
        location: true,
        tags: {
          include: {
            tag: true,
          },
        },
        organization: true,
      },
    });

    expect(createdEvent).not.toBeNull();
    if (!createdEvent) throw new Error('Expected created event');

    const result = await EventService.getEditData(createdEvent.id, authUser);

    expect(result.event.id).toBe(createdEvent.id);
    expect(result.event.title).toBe(input.eventName);
    expect(result.event.organization.name).toBe(fakeOrg.org.orgName);
    expect(result.event.tags.map((tag) => tag.label).sort()).toEqual(['community', 'drag']);
    expect(result.imageUrl).toBe('https://example.com/image.jpg');
    expect(result.imageMetadata).toEqual({
      storagePath: input.image.storagePath,
      contentType: input.image.contentType,
      sizeBytes: input.image.sizeBytes,
      originalName: input.image.originalName,
    });
    expect(result.location).toEqual({
      placeId: input.location?.placeId,
      address: input.location?.address,
      lat: input.location?.lat,
      lng: input.location?.lng,
    });
    expect(ImageService.getDownloadUrl).toHaveBeenCalledWith(input.image.storagePath);
  });

  it('throws unauthorized when actor does not own the event', async () => {
    const owner = await createAuthOrgIntegration();
    const otherOrg = await createAuthOrgIntegration();
    const input = eventInputFactory(
      {
        eventName: 'Protected Event',
        location: {
          placeId: 'protected-place-id',
          address: '123 Protected St',
          lat: 43.651,
          lng: -79.347,
        },
      },
      owner.authUser.firebaseUid
    );

    await EventService.createEvent(owner.authUser, input);

    const createdEvent = await prisma.flareEvent.findFirst({
      where: {
        organizationId: owner.fakeOrg.org.id,
        title: input.eventName,
      },
    });

    expect(createdEvent).not.toBeNull();
    if (!createdEvent) throw new Error('Expected created event');

    await expect(EventService.getEditData(createdEvent.id, otherOrg.authUser)).rejects.toThrow(
      expect.objectContaining({ code: 'AUTH_UNAUTHORIZED' })
    );
    expect(ImageService.getDownloadUrl).not.toHaveBeenCalled();
  });

  it('throws if event does not exist', async () => {
    const { authUser } = await createAuthOrgIntegration();

    await expect(EventService.getEditData('missing-event-id', authUser)).rejects.toThrow(
      expect.objectContaining({ code: 'EVENT_NOT_FOUND' })
    );
    expect(ImageService.getDownloadUrl).not.toHaveBeenCalled();
  });
});
