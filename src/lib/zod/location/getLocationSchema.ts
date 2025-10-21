import { GeoPoint } from "firebase/firestore";
import z from "zod";

export const getLocationSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  coordinates: z.object({lat: z.coerce.number(), lng: z.coerce.number()})
});
