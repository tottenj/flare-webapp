import { EventService } from '@/lib/services/eventService/eventService';
import { createEventIntegration } from '../../factories/integration/event.factory';
import { createOrgIntegration } from '../../factories/integration/org.factory';
import { expect } from '@jest/globals';
import { authOrgFactory } from '../../factories/auth/authOrg.factory';

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
