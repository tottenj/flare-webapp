import '@testing-library/jest-dom';

import prisma from '@/lib/prisma/prisma';
import { resetTestDb } from './__tests__/utils/restTestDb';


beforeAll(async () => {
  await prisma.$connect();
  await resetTestDb(); 
});

beforeEach(async () => {
  await resetTestDb()
});

// Disconnect after all tests finish
afterAll(async () => {
  await prisma.$disconnect();
});
