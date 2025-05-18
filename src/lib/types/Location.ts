import { GeoPoint } from "firebase/firestore"

export default interface Location{
    id: string
    name?: string | null
    coordinates: GeoPoint
}