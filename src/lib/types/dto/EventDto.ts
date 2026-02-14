import { AgeRangeValue } from '@/lib/types/AgeRange';
import { EventCategory } from '@/lib/types/EventCategory';
import { PriceTypeValue } from '@/lib/types/PriceType';
import { Prisma } from '@prisma/client';

export type EventRow = Prisma.FlareEventGetPayload<{
  include: {
    image: {
      select: {
        storagePath: true;
      };
    };

    organization: {
      select: {
        orgName: true;
      };
    };

    location: {
      select: {
        address: true;
        placeId: true;
      };
    };
  };
}>;

export type EventDto = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  ageRestriction: AgeRangeValue;
  imagePath: string | null;
  startsAt: string;
  endsAt: string | null;
  timezone: string;
  organization: {
    name: string;
  };
  location: {
    address: string | null;
    placeId: string | null;
  };
  pricing: {
    type: PriceTypeValue;
    minCents: number | null;
    maxCents: number | null;
  };
  tags: string[];
};

export function mapEventRowToDto(row: EventRow): EventDto {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    startsAt: row.startsAtUTC.toISOString(),
    endsAt: row.endsAtUTC?.toISOString() ?? null,
    timezone: row.timezone,
    ageRestriction: row.ageRestriction,
    imagePath: row.image?.storagePath ?? null,
    organization: {
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
    tags: row.tags,
  };
}
