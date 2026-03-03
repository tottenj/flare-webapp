import { OrgSignUpInput } from '@/lib/schemas/auth/orgSignUpSchema';
import deepMerge from '../utils/deepMerge';

let counter = 1;

function buildBaseInput(): OrgSignUpInput {
  const id = counter++;

  return {
    idToken: `idToken-${id}`,
    org: {
      name: `orgName-${id}`,
      email: `test-${id}@example.com`,
      location: {
        placeId: `place-${id}`,
        address: 'address',
        lat: 12,
        lng: 14,
      },
    },
  };
}

export default function orgSignUpInputFactory(overrides?: Partial<OrgSignUpInput>): OrgSignUpInput {
  const base = buildBaseInput();
  return deepMerge(base, overrides);
}