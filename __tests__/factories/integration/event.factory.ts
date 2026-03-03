import { Prisma } from '@prisma/client';
import deepMerge from '../utils/deepMerge';

let counter = 1;

function futureDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function buildBaseEvent(organizationId: string): Prisma.FlareEventCreateInput {
  return {
    organization: { connect: { id: organizationId } },
    status: 'PUBLISHED',
    publishedAt: new Date(),
    title: `Test Event ${counter}`,
    description: 'Integration Event',
    category: 'OTHER',
    ageRestriction: 'ALL_AGES',
    startsAtUTC: futureDate(1),
    timezone: 'America/Toronto',
    pricingType: 'FREE',
    currency: 'CAD',
    tags: undefined,
  };
}

export async function createEventIntegration(params: {
  organizationId: string;
  overrides?: Partial<Prisma.FlareEventCreateInput>;
}) {
  const data = deepMerge(buildBaseEvent(params.organizationId), params.overrides);
  return await prisma.flareEvent.create({ data });
}
