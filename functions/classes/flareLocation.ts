import { GeoPoint as AdminGeoPoint } from 'firebase-admin/firestore';
import { GeoPoint as ClientGeoPoint } from 'firebase/firestore';

export default interface flareLocation {
  id: string;
  name?: string | null;
  coordinates: AdminGeoPoint | ClientGeoPoint;
}
