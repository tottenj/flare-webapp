import { locationDal } from '@/lib/dal/locationDal/LocationDal';
import deepMerge from '../utils/deepMerge';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';

let counter = 1;

function buildBaseLocation() {
  const id = counter++;
  return {
    placeId: `test-place-${id}`,
    address: '123 Test St Toronto',
    lat: 43.6532,
    lng: -79.3832,
  };
}

export async function createLocationIntegration(overrides?: Partial<LocationInput>) {
  const input = deepMerge(buildBaseLocation(), overrides);
  return locationDal.create(input);
}
