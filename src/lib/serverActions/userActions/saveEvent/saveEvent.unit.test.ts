import saveEvent from '@/lib/serverActions/userActions/saveEvent/saveEvent';
import { EventErrors } from '@/lib/errors/eventErrors/EventErrors';
import { EventService } from '@/lib/services/eventService/eventService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { expectFail } from '@/lib/test/expectFail';
import { expect } from '@jest/globals';

jest.mock('@/lib/services/userContextService/userContextService', () => ({
  __esModule: true,
  UserContextService: {
    requireUser: jest.fn(),
    getEventActor: jest.fn(),
  },
}));

jest.mock('@/lib/services/eventService/eventService', () => ({
  __esModule: true,
  EventService: {
    saveEvent: jest.fn(),
  },
}));

describe('saveEvent', () => {
  const input = {
    eventId: 'event-1',
    save: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully saves an event as a regular user', async () => {
    const actor = {
      userId: 'user-1',
      firebaseUid: 'firebase-uid-1',
      organizationIds: [],
    };

    const userCtx = {
      user: {
        id: 'user-1',
        firebaseUid: 'firebase-uid-1',
      },
      organizationMemberships: [],
    };

    (UserContextService.requireUser as jest.Mock).mockResolvedValue(userCtx);
    (UserContextService.getEventActor as jest.Mock).mockReturnValue(actor);
    (EventService.saveEvent as jest.Mock).mockResolvedValue(undefined);

    const result = await saveEvent(input);

    expect(UserContextService.requireUser).toHaveBeenCalled();
    expect(UserContextService.getEventActor).toHaveBeenCalledWith(userCtx);
    expect(EventService.saveEvent).toHaveBeenCalledWith(input.eventId, actor, input.save);
    expect(result).toEqual({ ok: true, data: undefined });
  });

  it('passes all memberships when saving an event', async () => {
    const userCtx = {
      user: {
        id: 'user-1',
        firebaseUid: 'firebase-uid-1',
      },
      organizationMemberships: [
        { organization: { id: 'org-1' } },
        { organization: { id: 'org-2' } },
      ],
    };

    (UserContextService.requireUser as jest.Mock).mockResolvedValue(userCtx);
    const actor = {
      userId: 'user-1',
      firebaseUid: 'firebase-uid-1',
      organizationIds: ['org-1', 'org-2'],
    };
    (UserContextService.getEventActor as jest.Mock).mockReturnValue(actor);
    (EventService.saveEvent as jest.Mock).mockResolvedValue(undefined);

    const result = await saveEvent(input);

    expect(UserContextService.getEventActor).toHaveBeenCalledWith(userCtx);
    expect(EventService.saveEvent).toHaveBeenCalledWith(input.eventId, actor, input.save);
    expect(result).toEqual({ ok: true, data: undefined });
  });

  it('returns INVALID_INPUT when request payload is invalid', async () => {
    const result = await saveEvent({
      eventId: 'event-1',
      save: 'yes' as unknown as boolean,
    });

    const failed = expectFail(result);
    expect(failed.code).toBe('INVALID_INPUT');
    expect(UserContextService.requireUser).not.toHaveBeenCalled();
    expect(EventService.saveEvent).not.toHaveBeenCalled();
  });

  it('returns AppError from EventService when save fails with known error', async () => {
    const actor = {
      userId: 'user-1',
      firebaseUid: 'firebase-uid-1',
      organizationIds: [],
    };

    const userCtx = {
      user: {
        id: 'user-1',
        firebaseUid: 'firebase-uid-1',
      },
      organizationMemberships: [],
    };

    (UserContextService.requireUser as jest.Mock).mockResolvedValue(userCtx);
    (UserContextService.getEventActor as jest.Mock).mockReturnValue(actor);
    (EventService.saveEvent as jest.Mock).mockRejectedValue(EventErrors.CannotSaveOwnEvent());

    const result = await saveEvent(input);

    const failed = expectFail(result);
    expect(failed.code).toBe('CANNOT_SAVE_OWN_EVENT');
  });

  it('returns UNKNOWN when save fails with unexpected error', async () => {
    const actor = {
      userId: 'user-1',
      firebaseUid: 'firebase-uid-1',
      organizationIds: [],
    };

    const userCtx = {
      user: {
        id: 'user-1',
        firebaseUid: 'firebase-uid-1',
      },
      organizationMemberships: [],
    };

    (UserContextService.requireUser as jest.Mock).mockResolvedValue(userCtx);
    (UserContextService.getEventActor as jest.Mock).mockReturnValue(actor);
    (EventService.saveEvent as jest.Mock).mockRejectedValue(new Error('oops'));

    const result = await saveEvent(input);

    const failed = expectFail(result);
    expect(failed.code).toBe('UNKNOWN');
  });
});
