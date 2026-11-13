import { LocationInputSchema } from "@/lib/schemas/LocationInputSchema";
import z from "zod";

export const orgCreateSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  location: LocationInputSchema,
  description: z.string().min(1, "Description is required"),
});