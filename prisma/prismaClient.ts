import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '#prisma/generated/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
