import { EventDto } from '@/lib/types/dto/EventDto';
import { EventCategory } from '@prisma/client';
import { PRICE_TYPE } from '@/lib/types/PriceType';
import { AGE_RANGE } from '@/lib/types/AgeRange';

export function eventDtoFactory(overrides: Partial<EventDto> = {}): EventDto {
  const base: EventDto = {
    id: 'event-1',
    title: 'Test Event',
    description: 'This is a test event',
    category: EventCategory.SOCIAL,
    ageRestriction: AGE_RANGE['All Ages'],
    status: 'PUBLISHED',

    imagePath: 'events/uid3/image.jpg',

    startsAt: new Date('2026-03-01T19:00:00Z').toISOString(),
    endsAt: new Date('2026-03-01T22:00:00Z').toISOString(),
    timezone: 'America/Toronto',

    organization: {
      name: 'Test Org',
    },

    location: {
      address: '123 Test St',
      placeId: 'place-id-123',
    },

    pricing: {
      type: PRICE_TYPE.Free,
      minCents: null,
      maxCents: null,
    },

    tags: [],
  };

  return {
    ...base,
    ...overrides,

    organization: {
      ...base.organization,
      ...overrides.organization,
    },

    location: {
      ...base.location,
      ...overrides.location,
    },

    pricing: {
      ...base.pricing,
      ...overrides.pricing,
    },

    tags: overrides.tags ?? base.tags,
  };
}
