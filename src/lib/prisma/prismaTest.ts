// src/lib/prisma/testClient.ts
import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL?.includes('test')) {
  throw new Error('Prisma test client should only be used with a test database!');
}

const prisma = new PrismaClient({
  log: ['query'],
});

export default prisma;
