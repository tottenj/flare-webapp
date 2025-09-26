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
    name: createOrg.location.name,
  },
  verified: false,
  profilePic: null,
};

export const preMadeOrg = {
  email: 'orgOne@gmail.com',
  password: 'password',
  name: 'Org One',
  location: {
    coordinates: {
      latitude: 43.65348,
      longitude: -79.38393,
    },
    id: 'ChIJpTvG15DL1IkRd8S0KlBVNTI',
    name: 'CN Tower, Toronto',
  },
  status: "Pending"
};


export const preMadeVerifiedOrg = {
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
};