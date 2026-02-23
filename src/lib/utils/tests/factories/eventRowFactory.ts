import { EventRow } from "@/lib/types/dto/EventDto";

export function buildEventRow(overrides?: Partial<EventRow>): EventRow {
  const base: EventRow = {
    id: 'event-id-1',
    title: 'Test Event',
    description: 'Test description',
    category: 'DRAG' as any,
    status: 'PUBLISHED',
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
    ageRestriction: 'NINETEEN_PLUS' as any,
    timezone: 'America/Toronto',
    startsAtUTC: new Date('2026-01-01T00:00:00Z'),
    endsAtUTC: new Date('2026-01-01T02:00:00Z'),
    pricingType: 'FIXED' as any,
    minPriceCents: 2500,
    maxPriceCents: null,
    tags: [{tag:{id: "id1", label: 'drag'}}, {tag:{id: "id2", label: 'community'}}],
    imageId: 'image-id',
    locationId: 'location-id',
    organizationId: 'org-id',
    currency: 'CAD',

    image: { storagePath: 'events/org-id/image.jpg' },
    organization: { orgName: 'Test Org', status: 'VERIFIED' },
    location: { address: '123 Test Street', placeId: 'place-123' },
  };

  return { ...base, ...overrides };
}
