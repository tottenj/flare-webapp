import '@testing-library/jest-dom';
import { prisma } from './prisma/prismaClient';
import { resetTestDb, resetTestDbFast, resetTestDbNoSeed } from './__tests__/utils/restTestDb';
import AuthGateway from '@/lib/auth/authGateway';

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await resetTestDbFast()
})


// Disconnect after all tests finish
afterAll(async () => {
  await prisma.$disconnect();
});

jest.mock('@/lib/auth/authGateway', () => ({
  verifyIdToken: jest.fn(),
  createSession: jest.fn(),
}));



(AuthGateway.createSession as jest.Mock).mockResolvedValue({
  sessionCookie: 'sessionCookie',
});


