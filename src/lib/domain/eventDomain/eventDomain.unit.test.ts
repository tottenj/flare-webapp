import { CreateEventResolved, EventDomain } from '@/lib/domain/eventDomain/EventDomain';
import { EventErrors } from '@/lib/errors/eventErrors/EventErrors';
import { expect } from '@jest/globals';

function eventDomainCreateFactory(overrides?: Partial<CreateEventResolved>): CreateEventResolved {
  const base = {
    status: 'DRAFT' as const,
    eventName: 'Test Event',
    eventDescription: 'This is a test event.',
    category: 'SOCIAL' as const,
    priceType: 'FREE' as const,
    minPrice: undefined,
    maxPrice: undefined,
    startDateTime: '2024-07-01T20:00:00-04:00[America/New_York]',
    endDateTime: '2024-07-01T23:00:00-04:00[America/New_York]',
    ageRestriction: 'AGE_18_PLUS' as const,
    tags: ['id1', 'id2'],
    imageId: 'image123',
  };
  return {
    ...base,
    ...overrides,
  };
}

describe('EventDomain.onCreate', () => {
  it('creates EventDomain with correct properties', () => {
    const input = eventDomainCreateFactory();
    const organizationId = 'org123';
    const eventDomain = EventDomain.onCreate(input, organizationId);
    expect(eventDomain.props).toMatchObject({
      title: input.eventName,
      description: input.eventDescription,
      category: input.category,
      pricingType: input.priceType,
      startsAtUTC: new Date('2024-07-02T00:00:00.000Z'),
      endsAtUTC: new Date('2024-07-02T03:00:00.000Z'),
      timezone: 'America/New_York',
      ageRestriction: input.ageRestriction,
      imageId: input.imageId,
      locationId: undefined,
      organizationId,
      status: 'DRAFT',
      publishedAt: null,
      tags: ['id1', 'id2'],
    });
    expect(eventDomain.props.minPriceCents).toBeUndefined();
    expect(eventDomain.props.maxPriceCents).toBeUndefined();
  });

  it('creates EventDomain with publishedAt when status is PUBLISHED', () => {
    const input = eventDomainCreateFactory({ status: 'PUBLISHED' });
    const organizationId = 'org123';
    const eventDomain = EventDomain.onCreate(input, organizationId);
    expect(eventDomain.props.publishedAt).toBeInstanceOf(Date);
  });

  it('creates an event with no end time', () => {
    const input = eventDomainCreateFactory({ endDateTime: undefined });
    const organizationId = 'org123';
    const eventDomain = EventDomain.onCreate(input, organizationId);
    expect(eventDomain.props.endsAtUTC).toBeNull()
  });

  it('throws error for invalid time range', () => {
    const input = eventDomainCreateFactory({
      startDateTime: '2024-07-01T20:00:00-04:00[America/New_York]',
      endDateTime: '2024-07-01T19:00:00-04:00[America/New_York]',
    });
    const organizationId = 'org123';
    expect(() => EventDomain.onCreate(input, organizationId)).toThrow(
      EventErrors.InvalidTimeRange()
    );
  });

  it('throws error for too many tags', () => {
    const input = eventDomainCreateFactory({tags:['id1','id2','id3','id4','id5','id6']})
    const organizationId = 'org123';
    expect(() => EventDomain.onCreate(input, organizationId)).toThrow(
      EventErrors.InvalidTagNumber()
    );
  });
});
