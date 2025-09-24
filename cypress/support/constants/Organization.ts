export const createOrg = {
  email: 'verifiedOrg@gmail.com',
  password: 'password',
  name: 'Verified Organization',
  location: {
    id: 'ChIJK4J5p5RzK4gRL6c1pFiP7Tw',
    coordinates: {
      latitude: 43.67772,
      longitude: -79.62482,
    },
    name: 'Toronto Pearson International Airport',
  },
  instagram: 'orgInsta',
  twitter: 'orgTwitter',
  facebook: 'orgFacebook',
};

export const createOrgResponse = {
  email: createOrg.email,
  name: createOrg.name,
  location: {
    coordinates: createOrg.location.coordinates,
    name: createOrg.location.name
  },
  verified: false,
  profilePic: null,
};
