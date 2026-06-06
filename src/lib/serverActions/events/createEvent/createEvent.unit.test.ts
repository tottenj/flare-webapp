import { EventErrors } from '@/lib/errors/eventErrors/EventErrors';
import { MoneyError } from '@/lib/errors/moneyError/MoneyError';
import { logger } from '@/lib/logger';
import { updateTag } from 'next/cache';
import createEvent from '@/lib/serverActions/events/createEvent/createEvent';
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
    createEvent: jest.fn(),
  },
}));

jest.mock('next/cache', () => ({
  updateTag: jest.fn(),
}));

describe('createEvent', () => {
  const input = {
    eventName: 'Test Event',
    eventDescription: 'This is a test event',
    startDateTime: '2026-02-15T19:00:00-05:00[America/Toronto]',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
    ageRestriction: AgeRestriction.ALL_AGES,
    image: {
      storagePath: 'events/uid123/image.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 1024,
      originalName: 'image.jpg',
    },
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

  it('successfully creates an event', async () => {
    const result = await createEvent(input);

    expect(result).toEqual({ ok: true, data: null });
    expect(EventService.createEvent).toHaveBeenCalledWith(
      { userId: 'userId', firebaseUid: 'uid123', orgId: 'orgId' },
      input
    );
    expect(updateTag).toHaveBeenCalledWith('public-events');
  });

  it('returns invalid input failure and deletes uploaded image when owned by user', async () => {
    const invalidInput = { ...input, eventName: '' };

    const result = await createEvent(invalidInput);

    expect(result.ok).toBe(false);
    expect(expectFail(result as ActionResult<null>).code).toBe('INVALID_INPUT');
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith('events/uid123/image.jpg');
    expect(EventService.createEvent).not.toHaveBeenCalled();
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('does not delete image when storage path does not belong to user', async () => {
    const invalidInput = {
      ...input,
      eventName: '',
      image: { ...input.image, storagePath: 'invalid_path/image.jpg' },
    };

    const result = await createEvent(invalidInput);

    expect(result.ok).toBe(false);
    expect(expectFail(result as ActionResult<null>).code).toBe('INVALID_INPUT');
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('logs storage cleanup errors and still returns invalid input', async () => {
    (ImageService.deleteByStoragePath as jest.Mock).mockRejectedValue(new Error('Deletion failed'));
    const invalidInput = { ...input, eventName: '' };

    const result = await createEvent(invalidInput);

    expect(result.ok).toBe(false);
    expect(expectFail(result as ActionResult<null>).code).toBe('INVALID_INPUT');
    expect(logger.error).toHaveBeenCalledWith(
      'STORAGE_ERROR',
      expect.objectContaining({ error: expect.any(Error) })
    );
  });

  it('handles unknown event creation error', async () => {
    (EventService.createEvent as jest.Mock).mockRejectedValue(new Error('Creation failed'));

    const error = expectFail(await createEvent(input));

    expect(error.code).toBe('UNKNOWN');
    expect(updateTag).not.toHaveBeenCalled();
  });

  it('handles MoneyError correctly', async () => {
    const error = new MoneyError('Money error occurred');
    (EventService.createEvent as jest.Mock).mockRejectedValueOnce(error);

    const result = expectFail(await createEvent(input));

    expect(result.code).toBe('MONEY_ERROR');
  });

  it('handles AppError correctly', async () => {
    const error = EventErrors.UnableToFetchEvents();
    (EventService.createEvent as jest.Mock).mockRejectedValueOnce(error);

    const result = expectFail(await createEvent(input));

    expect(result.code).toBe('UNABLE_TO_FETCH_EVENTS');
  });
});
