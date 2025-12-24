import '@testing-library/jest-dom';
import {prisma} from "./prisma/prismaClient"
import { resetTestDb } from './__tests__/utils/restTestDb';
import AuthGateway from '@/lib/auth/authGateway';


beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await resetTestDb()
});

// Disconnect after all tests finish
afterAll(async () => {
  await prisma.$disconnect();
});


jest.mock('@/lib/auth/authGateway', () => ({
  verifyIdToken: jest.fn(),
}));

(AuthGateway.verifyIdToken as jest.Mock).mockResolvedValue({
  uid: 'firebase-uid-123',
  email: 'test@example.com',
  emailVerified: true,
});
