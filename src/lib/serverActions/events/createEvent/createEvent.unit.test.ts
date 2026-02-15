import { EventErrors } from '@/lib/errors/eventErrors/EventErrors';
import { MoneyError } from '@/lib/errors/moneyError/MoneyError';
import { logger } from '@/lib/logger';
import createEvent from '@/lib/serverActions/events/createEvent/createEvent';
import { EventService } from '@/lib/services/eventService/eventService';
import ImageService from '@/lib/services/imageService/ImageService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { expectFail } from '@/lib/test/expectFail';
import { PRICE_TYPE } from '@/lib/types/PriceType';
import { expect } from '@jest/globals';
import { AgeRestriction, EventCategory } from '@prisma/client';

jest.mock('@/lib/services/userContextService/userContextService', () => ({
  __esModule: true,
  UserContextService: {
    requireUser: jest.fn(),
    requireOrg: jest.fn(),
  },
}));
jest.mock('@/lib/services/eventService/eventService', () => ({
  __esModule: true,
  EventService: {
    createEvent: jest.fn(),
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

describe('createEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (UserContextService.requireOrg as jest.Mock).mockResolvedValue({
      user: {
        id: 'userId',
        firebaseUid: 'uid123',
      },
      profile: {
        orgProfile: {
          id: 'orgId',
        },
      },
    });
  });

  it('successfully creates an event', async () => {
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
    const result = await createEvent(input);
    expect(result).toEqual({ ok: true, data: null });
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('Errors on invalid input and deletes uploaded image', async () => {
    const input = {
      eventName: '', // Invalid: empty name
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
    const result = await createEvent(input);
    expect(result.ok).toBe(false);
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith('events/uid123/image.jpg');
  });

  it('Does not attempt image deletion if storage path is invalid', async () => {
    const input = {
      eventName: '', // Invalid: empty name
      eventDescription: 'This is a test event',
      startDateTime: '2026-02-15T19:00:00-05:00[America/Toronto]',
      status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
      ageRestriction: AgeRestriction.ALL_AGES,
      image: {
        storagePath: 'invalid_path/image.jpg', // Invalid path
        contentType: 'image/jpeg',
        sizeBytes: 1024,
        originalName: 'image.jpg',
      },
      category: EventCategory.SOCIAL,
      priceType: PRICE_TYPE.Free,
      tags: [],
    };
    const result = expectFail(await createEvent(input));
    expect(result.code).toBe('INVALID_INPUT');
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
  });

  it('Handles image deletion error gracefully', async () => {
    (ImageService.deleteByStoragePath as jest.Mock).mockRejectedValue(new Error('Deletion failed'));
    const input = {
      eventName: '', // Invalid: empty name
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
    const result = expectFail(await createEvent(input));
    expect(result.code).toBe('INVALID_INPUT');
    expect(logger.error).toHaveBeenCalledWith(
      'STORAGE_ERROR',
      expect.objectContaining({ error: expect.any(Error) })
    );
  });

  it('Handles unknown event creation error', async () => {
    (EventService.createEvent as jest.Mock).mockRejectedValue(new Error('Creation failed'));
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
    const error = expectFail(await createEvent(input));
    expect(error.code).toBe('UNKNOWN');
  });

  it('Handles MoneyError correctly', async () => {
    const error = new MoneyError('Money error occurred');
    (EventService.createEvent as jest.Mock).mockRejectedValueOnce(error);
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
    const result = expectFail(await createEvent(input));
    expect(result.code).toBe('MONEY_ERROR');
  });

  it('Handles AppError correctly', async () => {
    const error = EventErrors.UnableToFetchEvents();
    (EventService.createEvent as jest.Mock).mockRejectedValueOnce(error);
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
    const result = expectFail(await createEvent(input));
    expect(result.code).toBe('UNABLE_TO_FETCH_EVENTS');
  });
});
