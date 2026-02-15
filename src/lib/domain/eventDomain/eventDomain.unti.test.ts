import { CreateEventResolved, EventDomain } from '@/lib/domain/eventDomain/EventDomain';
import { EventErrors } from '@/lib/errors/eventErrors/EventErrors';
import { expect } from '@jest/globals';

describe('EventDomain.onCreate', () => {
  it('creates EventDomain with correct properties', () => {
    const input: CreateEventResolved = {
      status: 'DRAFT',
      eventName: 'Test Event',
      eventDescription: 'This is a test event.',
      category: 'SOCIAL',
      priceType: 'FREE',
      minPrice: undefined,
      maxPrice: undefined,
      startDateTime: '2024-07-01T20:00:00-04:00',
      endDateTime: '2024-07-01T23:00:00-04:00',
      ageRestriction: 'AGE_18_PLUS',
      tags: ['concert', 'live'],
      imageId: 'image123',
    };

    const organizationId = 'org123';
    const eventDomain = EventDomain.onCreate(input, organizationId);

    expect(eventDomain.props).toEqual({
      title: input.eventName,
      description: input.eventDescription,
      category: input.category,
      pricingType: input.priceType,
      minPriceCents: null,
      maxPriceCents: null,
      startsAtUTC: new Date('2024-07-02T00:00:00.000Z'),
      endsAtUTC: new Date('2024-07-02T03:00:00.000Z'),
      timezone: 'America/New_York',
      ageRestriction: input.ageRestriction,
      imageId: input.imageId,
      locationId: undefined,
      organizationId,
      status: 'DRAFT',
      publishedAt: null,
      tags: ['concert', 'live'],
    });
  });

  it('creates EventDomain with publishedAt when status is PUBLISHED', () => {
    const input: CreateEventResolved = {
      status: 'PUBLISHED',
      eventName: 'Test Event',
      eventDescription: 'This is a test event.',
      category: 'SOCIAL',
      priceType: 'FREE',
      minPrice: undefined,
      maxPrice: undefined,
      startDateTime: '2024-07-01T20:00:00-04:00',
      endDateTime: '2024-07-01T23:00:00-04:00',
      ageRestriction: 'AGE_18_PLUS',
      tags: ['concert', 'live'],
      imageId: 'image123',
    };

    const organizationId = 'org123';
    const beforeCreation = new Date();
    const eventDomain = EventDomain.onCreate(input, organizationId);
    const afterCreation = new Date();

    expect(eventDomain.props.publishedAt).toBeInstanceOf(Date);
  });

  it('creates an event with no end time', () => {
    const input: CreateEventResolved = {
      status: 'DRAFT',
      eventName: 'Test Event',
      eventDescription: 'This is a test event.',
      category: 'SOCIAL',
      priceType: 'FREE',
      minPrice: undefined,
      maxPrice: undefined,
      startDateTime: '2024-07-01T20:00:00-04:00',
      endDateTime: undefined,
      ageRestriction: 'AGE_18_PLUS',
      tags: ['concert', 'live'],
      imageId: 'image123',
    };

    const organizationId = 'org123';
    const eventDomain = EventDomain.onCreate(input, organizationId);

    expect(eventDomain.props.endsAtUTC).toBeNull();
  });

  it('throws error for invalid time range', () => {
    const input: CreateEventResolved = {
      status: 'PUBLISHED',
      eventName: 'Test Event',
      eventDescription: 'This is a test event.',
      category: 'SOCIAL',
      priceType: 'FREE',
      minPrice: undefined,
      maxPrice: undefined,
      startDateTime: '2024-07-01T20:00:00-04:00',
      endDateTime: '2024-07-01T19:00:00-04:00', // End time before start time
      ageRestriction: 'AGE_18_PLUS',
      tags: ['concert', 'live'],
      imageId: 'image123',
    };

    const organizationId = 'org123';
    expect(() => EventDomain.onCreate(input, organizationId)).toThrow(
      EventErrors.InvalidTimeRange()
    );
  });

  it('throws error for too many tags', () => {
    const input: CreateEventResolved = {
      status: 'PUBLISHED',
      eventName: 'Test Event',
      eventDescription: 'This is a test event.',
      category: 'SOCIAL',
      priceType: 'FREE',
      minPrice: undefined,
      maxPrice: undefined,
      startDateTime: '2024-07-01T20:00:00-04:00',
      endDateTime: '2024-07-01T23:00:00-04:00',
      ageRestriction: 'AGE_18_PLUS',
      tags: ['concert', 'live', 'music', 'fun', 'summer', 'extra'],
      imageId: 'image123',
    };

    const organizationId = 'org123';
    expect(() => EventDomain.onCreate(input, organizationId)).toThrow(
      EventErrors.InvalidTagNumber()
    );
  });
});
