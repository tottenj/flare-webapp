import { EventErrors } from '@/lib/errors/eventErrors/EventErrors';
import { MoneyError } from '@/lib/errors/moneyError/MoneyError';
import { logger } from '@/lib/logger';
import updateEvent from '@/lib/serverActions/events/updateEvent/updateEvent';
import ImageService from '@/lib/services/imageService/ImageService';
import { EventService } from '@/lib/services/eventService/eventService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { expectFail } from '@/lib/test/expectFail';
import { ActionResult } from '@/lib/types/responses/ActionResult';
import { PRICE_TYPE } from '@/lib/types/PriceType';
import { expect } from '@jest/globals';
import { AgeRestriction, EventCategory } from '#prisma/generated/enums';

jest.mock('@/lib/services/userContextService/userContextService', () => ({
  __esModule: true,
  UserContextService: {
    requireOrg: jest.fn(),
  },
}));

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: {
    deleteByStoragePath: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@/lib/logger', () => ({
  __esModule: true,
  logger: {
    error: jest.fn(),
  },
}));

jest.mock('@/lib/services/eventService/eventService', () => ({
  __esModule: true,
  EventService: {
    editEvent: jest.fn(),
  },
}));

describe('updateEvent', () => {
  const eventId = 'event-id';
  const input = {
    eventName: 'Test Event',
    eventDescription: 'This is a test event',
    startDateTime: '2026-02-15T19:00:00-05:00[America/Toronto]',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
    ageRestriction: AgeRestriction.ALL_AGES,
    image: { isNew: false as const, storagePath: 'events/uid123/image.jpg' },
    category: EventCategory.SOCIAL,
    priceType: PRICE_TYPE.Free,
    tags: [],
  };

  const ctx = {
    user: {
      id: 'userId',
      firebaseUid: 'uid123',
    },
    profile: {
      orgProfile: {
        id: 'orgId',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (UserContextService.requireOrg as jest.Mock).mockResolvedValue(ctx);
  });

  it('successfully updates an event', async () => {
    const result = await updateEvent(eventId, input);

    expect(result).toEqual({ ok: true, data: null });
    expect(EventService.editEvent).toHaveBeenCalledWith(
      eventId,
      { userId: 'userId', firebaseUid: 'uid123', orgId: 'orgId' },
      input
    );
  });

  it('returns invalid input failure and deletes new uploaded image when owned by user', async () => {
    const invalidInput = {
      ...input,
      eventName: '',
      image: {
        isNew: true as const,
        metadata: {
          storagePath: 'events/uid123/image.jpg',
          contentType: 'image/jpeg',
          sizeBytes: 1024,
          originalName: 'image.jpg',
        },
      },
    };

    const result = await updateEvent(eventId, invalidInput);

    expect(result.ok).toBe(false);
    expect(expectFail(result as ActionResult<null>).code).toBe('INVALID_INPUT');
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith('events/uid123/image.jpg');
    expect(EventService.editEvent).not.toHaveBeenCalled();
  });

  it('does not delete image when isNew is false and input is invalid', async () => {
    const invalidInput = { ...input, eventName: '' };

    const result = await updateEvent(eventId, invalidInput);

    expect(result.ok).toBe(false);
    expect(expectFail(result as ActionResult<null>).code).toBe('INVALID_INPUT');
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('logs storage cleanup errors and still returns invalid input', async () => {
    (ImageService.deleteByStoragePath as jest.Mock).mockRejectedValue(new Error('Deletion failed'));
    const invalidInput = {
      ...input,
      eventName: '',
      image: {
        isNew: true as const,
        metadata: {
          storagePath: 'events/uid123/image.jpg',
          contentType: 'image/jpeg',
          sizeBytes: 1024,
          originalName: 'image.jpg',
        },
      },
    };

    const result = await updateEvent(eventId, invalidInput);

    expect(result.ok).toBe(false);
    expect(expectFail(result as ActionResult<null>).code).toBe('INVALID_INPUT');
    expect(logger.error).toHaveBeenCalledWith(
      'STORAGE_ERROR',
      expect.objectContaining({ error: expect.any(Error) })
    );
  });

  it('handles unknown event update error', async () => {
    (EventService.editEvent as jest.Mock).mockRejectedValue(new Error('Update failed'));

    const error = expectFail(await updateEvent(eventId, input));

    expect(error.code).toBe('UNKNOWN');
  });

  it('handles MoneyError correctly', async () => {
    const error = new MoneyError('Money error occurred');
    (EventService.editEvent as jest.Mock).mockRejectedValueOnce(error);

    const result = expectFail(await updateEvent(eventId, input));

    expect(result.code).toBe('MONEY_ERROR');
  });

  it('handles AppError correctly', async () => {
    const error = EventErrors.UnableToFetchEvents();
    (EventService.editEvent as jest.Mock).mockRejectedValueOnce(error);

    const result = expectFail(await updateEvent(eventId, input));

    expect(result.code).toBe('UNABLE_TO_FETCH_EVENTS');
  });
});
