export interface basicUser {
  uid: string;
  email: string;
  password: string;
}

export const userEmailVerified: basicUser = {
  uid: 'uid1',
  email: 'user@gmail.com',
  password: 'password123',
};

export const userNotEmailVerified: basicUser = {
  uid: 'uid2',
  email: 'unverifiedUser@gmail.com',
  password: 'password123',
};

export const pendingOrg: basicUser = {
  uid: 'uid3',
  email: 'unverifiedOrg@gmail.com',
  password: 'password123',
};

export const nonPendingOrg: basicUser = {
  uid: 'uid4',
  email: 'verifiedOrg@gmail.com',
  password: 'password123',
};
