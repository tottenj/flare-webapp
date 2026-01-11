export interface basicUser {
  uid: string;
  email: string;
  password: string;
}

export const userEmailVerified: basicUser = {
  uid: 'user1',
  email: 'user@gmail.com',
  password: 'password123',
};

export const userNotEmailVerified: basicUser = {
  uid: 'user2',
  email: 'unverifiedUser@gmail.com',
  password: 'password123',
};

export const pendingOrg: basicUser = {
  uid: 'org1',
  email: 'unverifiedOrg@gmail.com',
  password: 'password123',
};

export const nonPendingOrg: basicUser = {
  uid: 'org2',
  email: 'verifiedOrg@gmail.com',
  password: 'password123',
};
