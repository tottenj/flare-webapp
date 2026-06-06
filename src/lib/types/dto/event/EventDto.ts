import type { EventDto } from '@/lib/schemas/event/eventDtoSchema';
import { Prisma } from '../../../../../prisma/generated/client';

export type EventRow = Prisma.FlareEventGetPayload<{
  include: typeof eventRowInclude;
}>;

export const eventRowInclude = {
  location: {
    select: {
      address: true,
      placeId: true,
    },
  },
  image: {
    select: {
      storagePath: true,
    },
  },
  tags: {
    select: {
      tag: {
        select: {
          label: true,
          id: true,
        },
      },
    },
  },
  organization: {
    select: {
      orgName: true,
      status: true,
    },
  },
} satisfies Prisma.FlareEventInclude;

export function mapEventRowToDto(row: EventRow): EventDto {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    startsAt: row.startsAtUTC.toISOString(),
    status: row.status,
    endsAt: row.endsAtUTC?.toISOString() ?? null,
    timezone: row.timezone,
    ageRestriction: row.ageRestriction,
    imagePath: row.image?.storagePath ?? null,
    organization: {
      id: row.organizationId,
      name: row.organization.orgName,
    },
    location: {
      address: row.location?.address ?? null,
      placeId: row.location?.placeId ?? null,
    },
    pricing: {
      type: row.pricingType,
      minCents: row.minPriceCents ?? null,
      maxCents: row.maxPriceCents ?? null,
    },
    ticketLink: row.ticketLink ?? null,
    viewer: undefined,
    tags: row.tags.map((eventTag) => ({ id: eventTag.tag.id, label: eventTag.tag.label })),
  };
}
