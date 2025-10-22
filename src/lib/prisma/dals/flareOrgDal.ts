import { Prisma } from "@/app/generated/prisma";
import prisma from "../prisma";



export default class flareOrgDal {
  async create(data: Prisma.FlareOrgCreateInput, tx?: Prisma.TransactionClient) {
    const db = tx ?? prisma;
    await db.flareOrg.create({
      data: {
        verified: false,
        ...data,
      },
    });
  }
}