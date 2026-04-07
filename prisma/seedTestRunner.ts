import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { seedTest } from './seedTest';
import { PrismaClient } from './generated/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

seedTest(prisma)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
