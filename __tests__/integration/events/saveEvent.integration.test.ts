import { EventService } from '@/lib/services/eventService/eventService';
import { createEventIntegration } from '../../factories/integration/event.factory';
import { createOrgIntegration } from '../../factories/integration/org.factory';
import { createUserIntegration } from '../../factories/integration/user.factory';
import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';
import { expect } from '@jest/globals';

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
