import { Prisma } from '@/app/generated/prisma';

export const createUser: Prisma.UserCreateInput= {
  id: "123abc",
  email:"createUser@gmail.com",
  account_type: "user"
};


export const preMadeUser1: Prisma.UserCreateInput = {
  id: 'user1',
  email: 'user@gmail.com',
  account_type: 'user',
};

export const preMadeUser2: Prisma.UserCreateInput = {
  id: 'org1',
  email: 'unverifiedOrg@gmail.com',
  account_type: 'org',
};

export const preMadeUser3: Prisma.UserCreateInput = {
  id: 'org2',
  email: 'verifiedOrg@gmail.com',
  account_type: 'org',
};
