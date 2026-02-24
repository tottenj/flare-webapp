import { CreateEvent } from '@/lib/schemas/event/createEventFormSchema';
import { EventRow } from '@/lib/types/dto/EventDto';
import { PRICE_TYPE } from '@/lib/types/PriceType';
import { AgeRestriction, EventCategory } from '@prisma/client';

export default function eventInputFactoryIntegration(overrides?: Partial<CreateEvent>): CreateEvent {
  const base = {
    eventName: 'Test Event',
    eventDescription: 'This is a test event',
    startDateTime: '2026-02-15T19:00:00-05:00[America/Toronto]',
    status: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED',
    ageRestriction: AgeRestriction.ALL_AGES,
    location: {
      placeId: 'placeId',
      address: '123 Test St',
      lat: 23.456,
      lng: 45.678,
    },
    image: {
      storagePath: 'events/uid3/image.jpg',
      contentType: 'image/jpeg',
      sizeBytes: 1024,
      originalName: 'image.jpg',
    },
    category: EventCategory.SOCIAL,
    priceType: PRICE_TYPE.Free,
    tags: [],
  };
  return {
    ...base,
    ...overrides,
  };
}
