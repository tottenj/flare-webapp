import {
  SEEDED_TEST_EVENTS,
  SEEDED_TEST_ORGS,
  SEEDED_TEST_USERS,
} from '../../prisma/seedTest.constants';

export interface basicUser {
  uid: string;
  email: string;
  password: string;
}

export const userEmailVerified: basicUser = {
  uid: SEEDED_TEST_USERS.activeUser.firebaseUid,
  email: SEEDED_TEST_USERS.activeUser.email,
  password: SEEDED_TEST_USERS.activeUser.password,
};

export const userEmailVerifiedPending: basicUser = {
  uid: SEEDED_TEST_USERS.pendingEmailVerifiedUser.firebaseUid,
  email: SEEDED_TEST_USERS.pendingEmailVerifiedUser.email,
  password: SEEDED_TEST_USERS.pendingEmailVerifiedUser.password,
};

export const userNotEmailVerified: basicUser = {
  uid: 'uid2',
  email: 'unverifiedUser@gmail.com',
  password: 'password123',
};

export const pendingOrg = {
  uid: SEEDED_TEST_USERS.pendingOrgUser.firebaseUid,
  email: SEEDED_TEST_USERS.pendingOrgUser.email,
  password: SEEDED_TEST_USERS.pendingOrgUser.password,
  orgName: SEEDED_TEST_ORGS.pendingOrg.orgName,
  status: SEEDED_TEST_ORGS.pendingOrg.status,
};

export const nonPendingOrg: basicUser = {
  uid: 'uid4',
  email: 'verifiedOrg@gmail.com',
  password: 'password123',
};

export const seededEvents = SEEDED_TEST_EVENTS;
