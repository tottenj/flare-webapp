import { EventService } from '@/lib/services/eventService/eventService';
import { createEventIntegration } from '../../factories/integration/event.factory';
import { createOrgIntegration } from '../../factories/integration/org.factory';
import { expect } from '@jest/globals';
import { authOrgFactory } from '../../factories/auth/authOrg.factory';
import { createAuthOrgIntegration } from '../../factories/integration/helpers/createAuthOrgIntegration';

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
