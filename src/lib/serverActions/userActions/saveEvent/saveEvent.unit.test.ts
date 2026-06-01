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
    getUserActor: jest.fn(),
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
    };

    const userCtx = {
      user: {
        id: 'user-1',
        firebaseUid: 'firebase-uid-1',
      },
      profile: {
        orgProfile: null,
      },
      flags: {
        isOrg: false,
      },
    };

    (UserContextService.requireUser as jest.Mock).mockResolvedValue(userCtx);
    (UserContextService.getUserActor as jest.Mock).mockReturnValue(actor);
    (EventService.saveEvent as jest.Mock).mockResolvedValue(undefined);

    const result = await saveEvent(input);

    expect(UserContextService.requireUser).toHaveBeenCalled();
    expect(UserContextService.getUserActor).toHaveBeenCalledWith(userCtx);
    expect(EventService.saveEvent).toHaveBeenCalledWith(input.eventId, actor, input.save);
    expect(result).toEqual({ ok: true, data: undefined });
  });

  it('successfully saves an event as an org user', async () => {
    const userCtx = {
      user: {
        id: 'user-1',
        firebaseUid: 'firebase-uid-1',
      },
      profile: {
        orgProfile: {
          id: 'org-1',
        },
      },
      flags: {
        isOrg: true,
      },
    };

    (UserContextService.requireUser as jest.Mock).mockResolvedValue(userCtx);
    (EventService.saveEvent as jest.Mock).mockResolvedValue(undefined);

    const result = await saveEvent(input);

    expect(UserContextService.getUserActor).not.toHaveBeenCalled();
    expect(EventService.saveEvent).toHaveBeenCalledWith(
      input.eventId,
      {
        orgId: 'org-1',
        userId: 'user-1',
        firebaseUid: 'firebase-uid-1',
      },
      input.save
    );
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

  it('returns AUTH_UNAUTHORIZED when no actor can be derived', async () => {
    const userCtx = {
      user: {
        userId: 'user-1',
        firebaseUid: 'firebase-uid-1',
      },
      profile: {
        orgProfile: null,
      },
      flags: {
        isOrg: false,
      },
    };

    (UserContextService.requireUser as jest.Mock).mockResolvedValue(userCtx);
    (UserContextService.getUserActor as jest.Mock).mockReturnValue(null);

    const result = await saveEvent(input);

    const failed = expectFail(result);
    expect(failed.code).toBe('AUTH_UNAUTHORIZED');
    expect(EventService.saveEvent).not.toHaveBeenCalled();
  });

  it('returns AppError from EventService when save fails with known error', async () => {
    const actor = {
      userId: 'user-1',
      firebaseUid: 'firebase-uid-1',
    };

    const userCtx = {
      user: {
        id: 'user-1',
        firebaseUid: 'firebase-uid-1',
      },
      profile: {
        orgProfile: null,
      },
      flags: {
        isOrg: false,
      },
    };

    (UserContextService.requireUser as jest.Mock).mockResolvedValue(userCtx);
    (UserContextService.getUserActor as jest.Mock).mockReturnValue(actor);
    (EventService.saveEvent as jest.Mock).mockRejectedValue(EventErrors.CannotSaveOwnEvent());

    const result = await saveEvent(input);

    const failed = expectFail(result);
    expect(failed.code).toBe('CANNOT_SAVE_OWN_EVENT');
  });

  it('returns UNKNOWN when save fails with unexpected error', async () => {
    const actor = {
      userId: 'user-1',
      firebaseUid: 'firebase-uid-1',
    };

    const userCtx = {
      user: {
        id: 'user-1',
        firebaseUid: 'firebase-uid-1',
      },
      profile: {
        orgProfile: null,
      },
      flags: {
        isOrg: false,
      },
    };

    (UserContextService.requireUser as jest.Mock).mockResolvedValue(userCtx);
    (UserContextService.getUserActor as jest.Mock).mockReturnValue(actor);
    (EventService.saveEvent as jest.Mock).mockRejectedValue(new Error('oops'));

    const result = await saveEvent(input);

    const failed = expectFail(result);
    expect(failed.code).toBe('UNKNOWN');
  });
});
