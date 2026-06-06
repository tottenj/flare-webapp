export interface SeededBasicUser {
  id: string;
  firebaseUid: string;
  email: string;
  password: string;
  status: 'ACTIVE' | 'PENDING';
  role: 'USER' | 'ORG' | 'ADMIN';
}

export interface SeededOrganization {
  id: string;
  orgName: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface SeededLocation {
  id: string;
  placeId: string;
  address: string;
  lat: number;
  lng: number;
}

export interface SeededImageAsset {
  id: string;
  storagePath: string;
  contentType?: string;
  sizeBytes?: number;
  originalName?: string;
}

export interface SeededTag {
  id: string;
  label: string;
  usageCount: number;
}

export interface SeededEventRecord {
  id: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED';
  timezone: string;
}

export const SEEDED_TEST_USERS = {
  activeUser: {
    id: '1',
    firebaseUid: 'uid1',
    email: 'user@gmail.com',
    password: 'password123',
    status: 'ACTIVE',
    role: 'USER',
  },
  pendingEmailVerifiedUser: {
    id: '1.5',
    firebaseUid: 'uid1.5',
    email: 'userEmailVerified2@gmail.com',
    password: 'password123',
    status: 'PENDING',
    role: 'USER',
  },
  pendingOrgUser: {
    id: '3',
    firebaseUid: 'uid3',
    email: 'unverifiedOrg@gmail.com',
    password: 'password123',
    status: 'ACTIVE',
    role: 'ORG',
  },
  verifiedOrgUser: {
    id: '5',
    firebaseUid: 'uid5',
    email: 'verifiedOrg@gmail.com',
    password: 'password123',
    status: 'ACTIVE',
    role: 'ORG',
  },
  adminUser: {
    id: '4',
    firebaseUid: 'uid4',
    email: 'admin@gmail.com',
    password: 'password123',
    status: 'ACTIVE',
    role: 'ADMIN',
  },
} as const satisfies Record<string, SeededBasicUser>;

export const SEEDED_TEST_ORGS = {
  pendingOrg: {
    id: 'org1',
    orgName: 'unverifiedOrg',
    status: 'PENDING',
  },
  verifiedOrg: {
    id: 'org2',
    orgName: 'verifiedOrg',
    status: 'VERIFIED',
  },
} as const satisfies Record<string, SeededOrganization>;

export const SEEDED_TEST_LOCATIONS = {
  primary: {
    id: 'location-primary',
    placeId: 'test-place-id-1',
    address:
      'Toronto Pearson International Airport (YYZ), Silver Dart Drive, Mississauga, ON, Canada',
    lat: 43.6777,
    lng: -79.6248,
  },
  editableEvent: {
    id: 'location-editable-event',
    placeId: 'seed-editable-place-id',
    address: '123 Seeded Event Street, Toronto, ON, Canada',
    lat: 43.7001,
    lng: -79.4163,
  },
  harbourfront: {
    id: 'location-harbourfront',
    placeId: 'seed-location-harbourfront',
    address: '235 Queens Quay W, Toronto, ON, Canada',
    lat: 43.6387,
    lng: -79.3818,
  },
  northYork: {
    id: 'location-northyork',
    placeId: 'seed-location-northyork',
    address: '5100 Yonge St, North York, ON, Canada',
    lat: 43.7696,
    lng: -79.4139,
  },
  scarborough: {
    id: 'location-scarborough',
    placeId: 'seed-location-scarborough',
    address: '300 Borough Dr, Scarborough, ON, Canada',
    lat: 43.7764,
    lng: -79.2578,
  },
} as const satisfies Record<string, SeededLocation>;

export const SEEDED_TEST_IMAGES = {
  sharedEvent: {
    id: 'stockEvent',
    storagePath: 'events/uid3/randoCrypto/stockEvent.jpg',
    contentType: 'image/jpeg',
    sizeBytes: 1024,
    originalName: 'stockEvent.jpg',
  },
  editableEvent: {
    id: 'editableEventImage',
    storagePath: 'events/uid3/randoCrypto/editable-event.jpg',
    contentType: 'image/jpeg',
    sizeBytes: 4096,
    originalName: 'editable-event.jpg',
  },
} as const satisfies Record<string, SeededImageAsset>;

export const SEEDED_TEST_TAGS = {
  genericOne: {
    id: 'tag1',
    label: 'tag1',
    usageCount: 1,
  },
  genericTwo: {
    id: 'tag2',
    label: 'tag2',
    usageCount: 1,
  },
  genericThree: {
    id: 'tag3',
    label: 'tag3',
    usageCount: 1,
  },
  editableDrag: {
    id: 'tag-edit-drag',
    label: 'drag',
    usageCount: 1,
  },
  editableCommunity: {
    id: 'tag-edit-community',
    label: 'community',
    usageCount: 1,
  },
} as const satisfies Record<string, SeededTag>;

export const SEEDED_TEST_EVENTS = {
  upcoming: {
    id: 'eventUpcoming',
    title: 'Upcoming Event',
    description: 'Future published event',
    status: 'PUBLISHED',
    timezone: 'America/Toronto',
  },
  past: {
    id: 'eventPast',
    title: 'Past Event',
    description: 'Past published event',
    status: 'PUBLISHED',
    timezone: 'America/Toronto',
  },
  draft: {
    id: 'eventDraft',
    title: 'Draft Event',
    description: 'Draft future event',
    status: 'DRAFT',
    timezone: 'America/Toronto',
  },
  published: {
    id: 'eventPublished',
    title: 'Another Published Event',
    description: 'Another future published event',
    status: 'PUBLISHED',
    timezone: 'America/Toronto',
  },
  editable: {
    id: 'eventEditable',
    title: 'Editable Seed Event',
    description: 'Seeded event with every edit field populated',
    status: 'PUBLISHED',
    timezone: 'America/Toronto',
    startsAtUTC: '2030-05-10T23:30:00.000Z',
    endsAtUTC: '2030-05-11T01:00:00.000Z',
    category: 'NIGHTLIFE',
    ageRestriction: 'AGE_19_PLUS',
    pricingType: 'RANGE',
    minPriceCents: 1500,
    maxPriceCents: 4500,
    location: SEEDED_TEST_LOCATIONS.editableEvent,
    image: SEEDED_TEST_IMAGES.editableEvent,
    tags: [SEEDED_TEST_TAGS.editableDrag, SEEDED_TEST_TAGS.editableCommunity],
  },
  verifiedUpcoming: {
    id: 'eventVerifiedUpcoming',
    title: 'Verified Org Upcoming Event',
    description: 'Future published event for verified org',
    status: 'PUBLISHED',
    timezone: 'America/Toronto',
  },
  verifiedPublished: {
    id: 'eventVerifiedPublished',
    title: 'Verified Org Published Event',
    description: 'Another future published event for verified org',
    status: 'PUBLISHED',
    timezone: 'America/Toronto',
  },
  verifiedDraft: {
    id: 'eventVerifiedDraft',
    title: 'Verified Org Draft Event',
    description: 'Draft future event for verified org',
    status: 'DRAFT',
    timezone: 'America/Toronto',
  },
  // Additional matrix-style fixtures for E2E filter coverage.
  filterSocialHarbourfront: {
    id: 'eventFilterSocialHarbourfront',
    title: 'Filter Fixture Social Harbourfront',
    description: 'Published social event at Harbourfront',
    status: 'PUBLISHED',
    timezone: 'America/Toronto',
    category: 'SOCIAL',
    ageRestriction: 'ALL_AGES',
    pricingType: 'FREE',
    location: SEEDED_TEST_LOCATIONS.harbourfront,
  },
  filterCultureNorthYork: {
    id: 'eventFilterCultureNorthYork',
    title: 'Filter Fixture Culture North York',
    description: 'Published culture event in North York',
    status: 'PUBLISHED',
    timezone: 'America/Toronto',
    category: 'CULTURE_ARTS',
    ageRestriction: 'AGE_19_PLUS',
    pricingType: 'RANGE',
    minPriceCents: 1200,
    maxPriceCents: 3200,
    location: SEEDED_TEST_LOCATIONS.northYork,
  },
  filterWellnessScarborough: {
    id: 'eventFilterWellnessScarborough',
    title: 'Filter Fixture Wellness Scarborough',
    description: 'Published wellness event in Scarborough',
    status: 'PUBLISHED',
    timezone: 'America/Toronto',
    category: 'WELLNESS',
    ageRestriction: 'ALL_AGES',
    pricingType: 'FIXED',
    minPriceCents: 2500,
    location: SEEDED_TEST_LOCATIONS.scarborough,
  },
  filterAdvocacyPearson: {
    id: 'eventFilterAdvocacyPearson',
    title: 'Filter Fixture Advocacy Pearson',
    description: 'Published advocacy event near Pearson',
    status: 'PUBLISHED',
    timezone: 'America/Toronto',
    category: 'ADVOCACY_EDUCATION',
    ageRestriction: 'AGE_18_PLUS',
    pricingType: 'PWYC',
    location: SEEDED_TEST_LOCATIONS.primary,
  },
  filterOtherPendingOrg: {
    id: 'eventFilterOtherPendingOrg',
    title: 'Filter Fixture Other Pending Org',
    description: 'Published event for pending org; should stay hidden publicly',
    status: 'PUBLISHED',
    timezone: 'America/Toronto',
    category: 'OTHER',
    ageRestriction: 'ALL_AGES',
    pricingType: 'FREE',
    location: SEEDED_TEST_LOCATIONS.primary,
  },
} as const;
