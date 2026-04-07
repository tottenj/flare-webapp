export interface SeededBasicUser {
  id: string;
  firebaseUid: string;
  email: string;
  password: string;
  status: 'ACTIVE' | 'PENDING';
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
  },
  pendingEmailVerifiedUser: {
    id: '1.5',
    firebaseUid: 'uid1.5',
    email: 'userEmailVerified2@gmail.com',
    password: 'password123',
    status: 'PENDING',
  },
  pendingOrgUser: {
    id: '3',
    firebaseUid: 'uid3',
    email: 'unverifiedOrg@gmail.com',
    password: 'password123',
    status: 'ACTIVE',
  },
} as const satisfies Record<string, SeededBasicUser>;

export const SEEDED_TEST_ORGS = {
  pendingOrg: {
    id: 'org1',
    orgName: 'unverifiedOrg',
    status: 'PENDING',
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
} as const;
