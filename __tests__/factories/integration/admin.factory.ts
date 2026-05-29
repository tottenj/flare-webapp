import { Prisma } from '#prisma/generated/client.js';
import { createUserIntegration } from './user.factory';

export async function createAdminIntegration(overrides?: Partial<Prisma.UserCreateInput>) {
  return await createUserIntegration({ ...overrides, role: 'ADMIN' });
}
