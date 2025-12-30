import 'server-only';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../../prisma/prismaClient';

export class LocationDal {
  async create(input: LocationInput, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    const [location] = await client.$queryRaw<
      { id: string; placeId: string | null; address: string | null }[]
    >(Prisma.sql`
        INSERT INTO "Location" (
          "placeId",
          address,
          point,
          "createdAt"
        )
        VALUES (
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

export const locationDal = new LocationDal()