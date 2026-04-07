import 'server-only';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import { Prisma } from '#prisma/generated/client';
import { prisma } from '../../../../prisma/prismaClient';
import FlareLocation from '@/lib/types/location/Location';

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

  async get(id: string): Promise<FlareLocation | null> {
    const [location] = await prisma.$queryRaw<FlareLocation[]>(Prisma.sql`
        SELECT id, "placeId", address, ST_X(point::geometry) AS longitude, ST_Y(point::geometry) AS latitude
        FROM "Location"
        WHERE id = ${id}
      `);
    return location ?? null;
  }
}

export const locationDal = new LocationDal();
