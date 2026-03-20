import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '#prisma/generated/client';
import { seedTest } from './seedTest';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

seedTest(prisma)
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
