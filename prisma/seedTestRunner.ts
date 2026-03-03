import { PrismaClient } from '@prisma/client';
import { seedTest } from './seedTest';

const prisma = new PrismaClient();

seedTest(prisma)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
