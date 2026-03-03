// tests/factories/integration/user.factory.ts
import { prisma } from "../../../prisma/prismaClient"
import { Prisma } from '@prisma/client';
import deepMerge from "../utils/deepMerge";

let counter = 1;

function buildBaseUser(): Prisma.UserCreateInput {
  const id = counter++;
  return {
    email: `user${id}@test.com`,
    firebaseUid: `firebase-${id}`,
    role: 'USER',
    status: 'ACTIVE',
  };
}

export async function createUserIntegration(overrides?: Partial<Prisma.UserCreateInput>) {
  const data = deepMerge(buildBaseUser(), overrides);
  return prisma.user.create({ data });
}
