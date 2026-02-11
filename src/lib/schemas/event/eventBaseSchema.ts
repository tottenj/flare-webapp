import { LocationInputSchema } from "@/lib/schemas/LocationInputSchema";
import { parseZonedDateTime } from "@internationalized/date";
import z from "zod";

export const CreateEventBaseSchema = z.object({
  eventName: z.string().min(1),
  eventDescription: z.string().min(1),

  location: LocationInputSchema,
  tags: z.array(z.string()),

  startDateTime: z.string().refine((val) => {
    try {
      parseZonedDateTime(val);
      return true;
    } catch {
      return false;
    }
  }),

  ageRestriction: z.string(),
  priceType: z.string(),

  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

export type CreateEventBase = z.infer<typeof CreateEventBaseSchema>;
