import { preMadeLocation } from './FlareLocation';
import { preMadeUser2, preMadeUser3 } from './User';

export const createOrg = {
  name: "createOrg",
  email: 'createOrg@gmail.com',
  password: 'password123',
  location: preMadeLocation,
  instagram: 'orgInsta',
  twitter: 'orgTwitter',
  facebook: 'orgFacebook',
};

export const preMadeOrg1 = {
  user: preMadeUser2,
  password: 'password123',
  location: preMadeLocation,
  verified: false,
};


export const preMadeOrg2 = {
  user: preMadeUser3,
  password: 'password123',
  location: preMadeLocation,
  verified: true,
};
