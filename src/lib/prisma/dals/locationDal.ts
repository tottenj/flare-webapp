import { Prisma } from '@/app/generated/prisma';
import { createLocation } from '../dtos/LocationDto';
import prisma from '../prisma';
import cuid from 'cuid';

export default class locationDal {
  async create(loc: createLocation, tx?: Prisma.TransactionClient) {
    const db = tx ?? prisma;
    const id = cuid(); // generate in code

    const checkifexists = await prisma.location.findUnique({
      where:{place_id: loc.place_id}
    })
    if(checkifexists){
      return checkifexists.id
    }
    const [result] = await db.$queryRaw<{ id: string }[]>`
    INSERT INTO "location" ("id", "name", "place_id", "coordinates")
    VALUES (
      ${id},
      ${loc.name},
      ${loc.place_id},
      ST_SetSRID(ST_MakePoint(${loc.coordinates.lng}, ${loc.coordinates.lat}), 4326)::geography
    )
    RETURNING "id";
  `;

    return result.id;
  }
}
