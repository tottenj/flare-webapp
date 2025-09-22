export interface basicUser {
  email: string;
  password: string;
  name: string;
}

export const unverifiedUser: basicUser = {
  email: 'userEmail@gmail.com',
  password: 'password',
  name: 'unverified',
};
export const verifiedUser: basicUser = {
  email: 'userEmailVerified@gmail.com',
  password: 'password',
  name: 'verified',
};

export const org: basicUser = {
  email: 'org@gmail.com',
  password: 'org@gmail.com',
  name: 'organization',
};

export const verifiedOrg = {
  email: 'verifiedOrg@gmail.com',
  password: 'password',
  name: 'Verified Organization',
  location: {
    coordinates: {
      latitude: 43.67772,
      longitude: -79.62482,
    },
    id: 'ChIJK4J5p5RzK4gRL6c1pFiP7Tw',
    name: 'Toronto Pearson International Airport',
  },
  instagram: "orgInsta",
  twitter: "orgTwitter",
  facebook: "orgFacebook"
};
