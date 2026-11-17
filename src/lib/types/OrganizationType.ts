import type { OrganizationTypeValue } from '@/lib/schemas/org/OrganizationTypeSchema';

export const ORGANIZATION_TYPE_LABELS = {
  INDEPENDENT_ORGANIZER: 'Independent organizer / event producer',
  NONPROFIT_COMMUNITY_ORGANIZATION: 'Nonprofit / community organization',
  GRASSROOTS_COLLECTIVE_MUTUAL_AID: 'Grassroots collective / mutual aid',
  NIGHTLIFE_PROMOTER: 'Nightlife / promoter',
  VENUE_COMMUNITY_SPACE: 'Venue / community space',
  STUDENT_GROUP: 'Student group',
  SPORTS_RECREATION_GROUP: 'Sports / recreation group',
  ARTS_CULTURE_GROUP: 'Arts / culture group',
  OTHER: 'Other',
} as const satisfies Record<OrganizationTypeValue, string>;

export const ORGANIZATION_TYPE_OPTIONS = Object.entries(ORGANIZATION_TYPE_LABELS).map(
  ([value, label]) => ({ value: value as OrganizationTypeValue, label })
);
