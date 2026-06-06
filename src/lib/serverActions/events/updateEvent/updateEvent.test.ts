import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { authOrgFactory } from '../../../../../__tests__/factories/auth/authOrg.factory';
import { EventService } from '@/lib/services/eventService/eventService';
import { editEventInputFactory } from '../../../../../__tests__/factories/service/editEventInput.factory';
import editEvent from '@/lib/serverActions/events/updateEvent/updateEvent';
import { expect } from '@jest/globals';
import cleanupUploadedImageOnFailure from '@/lib/storage/cleanupUploadedImageOnFailure';
import { AppError } from '@/lib/errors/AppError';
import { expectFail } from '@/lib/test/expectFail';
import { updateTag } from 'next/cache';

jest.mock('@/lib/services/userContextService/userContextService', () => ({
  UserContextService: {
    requireOrg: jest.fn(),
    getOrgActor: jest.fn(),
  },
}));

jest.mock('@/lib/services/eventService/eventService', () => ({
  EventService: {
    editEvent: jest.fn(),
  },
}));

jest.mock('@/lib/storage/cleanupUploadedImageOnFailure', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('next/cache', () => ({
  updateTag: jest.fn(),
}));

describe('update event', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully updates an event', async () => {
    const actor = authOrgFactory();
    const ctx = {
      user: { firebaseUid: actor.firebaseUid },
    };

    (UserContextService.requireOrg as jest.Mock).mockResolvedValue(ctx);
    (UserContextService.getOrgActor as jest.Mock).mockReturnValue(actor);
    (EventService.editEvent as jest.Mock).mockResolvedValue(undefined);

    const event = editEventInputFactory();

    await expect(editEvent('id', event)).resolves.toEqual({ ok: true, data: undefined });
    expect(UserContextService.requireOrg).toHaveBeenCalled();
    expect(UserContextService.getOrgActor).toHaveBeenCalled();
    expect(EventService.editEvent).toHaveBeenCalledWith(
      'id',
      actor,
      expect.objectContaining(event)
    );
    expect(cleanupUploadedImageOnFailure).not.toHaveBeenCalled();
    expect(updateTag).toHaveBeenCalledWith('public-events');
  });

  it('fails with invalid input and cleans up uploaded image', async () => {
    const actor = authOrgFactory();
    const ctx = {
      user: { firebaseUid: actor.firebaseUid },
    };
    (UserContextService.requireOrg as jest.Mock).mockResolvedValue(ctx);
    (UserContextService.getOrgActor as jest.Mock).mockReturnValue(actor);

    const invalidEvent = { ...editEventInputFactory(), eventName: '' };

    const result = await editEvent('id', invalidEvent);
    expect(result.ok).toBe(false);
    expect(cleanupUploadedImageOnFailure).toHaveBeenCalledWith(invalidEvent, actor.firebaseUid);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('fails with service error and cleans up uploaded image', async () => {
    const actor = authOrgFactory();
    const ctx = {
      user: { firebaseUid: actor.firebaseUid },
    };
    (UserContextService.requireOrg as jest.Mock).mockResolvedValue(ctx);
    (UserContextService.getOrgActor as jest.Mock).mockReturnValue(actor);
    (EventService.editEvent as jest.Mock).mockRejectedValue(new Error('Service error'));

    const event = editEventInputFactory();

    const result = await editEvent('id', event);
    expect(result.ok).toBe(false);
    expect(cleanupUploadedImageOnFailure).toHaveBeenCalledWith(event, actor.firebaseUid);
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('fails with AppError and cleans up uploaded image', async () => {
    const actor = authOrgFactory();
    const ctx = {
      user: { firebaseUid: actor.firebaseUid },
    };
    (UserContextService.requireOrg as jest.Mock).mockResolvedValue(ctx);
    (UserContextService.getOrgActor as jest.Mock).mockReturnValue(actor);
    (EventService.editEvent as jest.Mock).mockRejectedValue(
      new AppError({ code: 'APP_ERROR', clientMessage: 'App error' })
    );

    const event = editEventInputFactory();

    const result = await editEvent('id', event);
    expect(result.ok).toBe(false);
    const error = expectFail(result);
    expect(error.code).toBe('APP_ERROR');
    expect(error.message).toBe('App error');
    expect(cleanupUploadedImageOnFailure).toHaveBeenCalledWith(event, actor.firebaseUid);
    expect(updateTag).not.toHaveBeenCalled();
  });
});
