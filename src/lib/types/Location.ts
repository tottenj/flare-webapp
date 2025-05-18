import { GeoPoint } from "firebase/firestore"

export default interface flareLocation{
    id: string
    name?: string | null
    coordinates: GeoPoint
}