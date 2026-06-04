import { EventService } from '@/lib/services/eventService/eventService';
import { createEventIntegration } from '../../factories/integration/event.factory';
import { createOrgIntegration } from '../../factories/integration/org.factory';
import { createUserIntegration } from '../../factories/integration/user.factory';
import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';
import { expect } from '@jest/globals';
import { prisma } from '../../../prisma/prismaClient';

describe('saveEvent (integration)', () => {
  it('saves an event for a user', async () => {
    const user = await createUserIntegration();
    const organization = await createOrgIntegration();
    const event = await createEventIntegration({ organizationId: organization.org.id });

    const actor: AuthenticatedUser = {
      userId: user.id,
      firebaseUid: user.firebaseUid,
    };
    await EventService.saveEvent(event.id, actor, true);

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        savedEvents: true,
      },
    });
    expect(userProfile?.savedEvents).not.toHaveLength(0);
    expect(userProfile?.savedEvents[0].eventId).toBe(event.id);
  });

  it('unsaves an event for a user', async () => {
    const organization = await createOrgIntegration();
    const event = await createEventIntegration({ organizationId: organization.org.id });
    const user = await createUserIntegration({ savedEvents: { create: { eventId: event.id } } });

    const actor: AuthenticatedUser = {
      userId: user.id,
      firebaseUid: user.firebaseUid,
    };

    await EventService.saveEvent(event.id, actor, false);

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        savedEvents: true,
      },
    });
    expect(userProfile?.savedEvents).toHaveLength(0);
  });

  it('throws if event does not exist', async () => {
    const user = await createUserIntegration();
    const actor: AuthenticatedUser = {
      userId: user.id,
      firebaseUid: user.firebaseUid,
    };
    await expect(EventService.saveEvent('non-existent-event-id', actor, true)).rejects.toThrow(
      expect.objectContaining({
        code: 'EVENT_NOT_FOUND',
      })
    );
  });

  it("throws if org saving it's own event", async () => {
    const organization = await createOrgIntegration();
    const event = await createEventIntegration({ organizationId: organization.org.id });

    const actor = {
      orgId: organization.org.id,
      userId: organization.user.id,
      firebaseUid: organization.user.firebaseUid,
    };

    await expect(EventService.saveEvent(event.id, actor, true)).rejects.toThrow(
      expect.objectContaining({
        code: 'CANNOT_SAVE_OWN_EVENT',
      })
    );
  });
});

describe('listSavedEvents (integration)', () => {
  it('lists saved events for a user', async () => {
    const user = await createUserIntegration();
    const organization = await createOrgIntegration();
    const event1 = await createEventIntegration({ organizationId: organization.org.id });
    const event2 = await createEventIntegration({ organizationId: organization.org.id });

    const actor: AuthenticatedUser = {
      userId: user.id,
      firebaseUid: user.firebaseUid,
    };

    await prisma.savedEvent.createMany({
      data: [
        { userId: user.id, eventId: event1.id },
        { userId: user.id, eventId: event2.id },
      ],
    });

    const savedEvents = await EventService.listSavedEvents(actor);
    expect(savedEvents).toHaveLength(2);
    expect(savedEvents.map((e) => e.id)).toEqual(expect.arrayContaining([event1.id, event2.id]));
  });

  it('returns an empty array when the user has no saved events', async () => {
    const user = await createUserIntegration();
    const actor: AuthenticatedUser = {
      userId: user.id,
      firebaseUid: user.firebaseUid,
    };

    const savedEvents = await EventService.listSavedEvents(actor);
    expect(savedEvents).toEqual([]);
  });

  it('does not return events saved by other users', async () => {
    const actorUser = await createUserIntegration();
    const otherUser = await createUserIntegration();
    const organization = await createOrgIntegration();
    const event = await createEventIntegration({ organizationId: organization.org.id });

    const actor: AuthenticatedUser = {
      userId: actorUser.id,
      firebaseUid: actorUser.firebaseUid,
    };

    await prisma.savedEvent.create({
      data: {
        userId: otherUser.id,
        eventId: event.id,
      },
    });

    const savedEvents = await EventService.listSavedEvents(actor);
    expect(savedEvents).toEqual([]);
  });
});
