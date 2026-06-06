import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import FlareLocation from '@/lib/types/location/Location';

export type EventFilterDataDto = {
  location?: LocationInput | null;
};

interface incomingEventFilterData {
  location?: FlareLocation | null;
}
export function mapEventFilterDataToDto(data: incomingEventFilterData): EventFilterDataDto {
  return {
    location: data.location
      ? {
          placeId: data.location.placeId,
          address: data.location.address,
          lat: data.location.latitude,
          lng: data.location.longitude,
        }
      : null,
  };
}
