import { GeoPoint } from "firebase/firestore";

export function handleLocationSchema(raw: Record<string, any>) {
  if (typeof raw.location === 'string') {
    raw.location = JSON.parse(raw.location);
  }

  // Convert coords into GeoPoint
  if (raw.location?.coordinates) {
    const { latitude, longitude } = raw.location.coordinates;
    raw.location.coordinates = new GeoPoint(latitude, longitude);
  }

 
  return raw.location;
}
