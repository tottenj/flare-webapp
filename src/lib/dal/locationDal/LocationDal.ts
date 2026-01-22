import 'server-only';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { Prisma } from '../../../../prisma/generated/prisma/client';
import { prisma } from '../../../../prisma/prismaClient';

export class LocationDal {
  async create(input: LocationInput, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    const id = crypto.randomUUID();
    const [location] = await client.$queryRaw<
      { id: string; placeId: string | null; address: string | null }[]
    >(Prisma.sql`
        INSERT INTO "Location" (
        id,
        "placeId",
        address,
        point,
        "createdAt"
      )
      VALUES (
        ${id},
        ${input.placeId},
        ${input.address ?? null},
        ST_SetSRID(
          ST_MakePoint(${input.lng}, ${input.lat}),
          4326
        )::geography,
        NOW()
      )
        ON CONFLICT ("placeId")
        DO UPDATE SET
          address = EXCLUDED.address
        RETURNING id, "placeId", address;
      `);

    return location;
  }
}

export const locationDal = new LocationDal();
