import { EventArgs } from "@/lib/classes/event/Event";
import eventType, { eventTypeKeys, eventTypeValue } from "@/lib/enums/eventType";
import z from "zod";
import { getLocationSchema } from "../location/getLocationSchema";
import AgeGroup, { ageGroupKeys, ageGroupValue } from "@/lib/enums/AgeGroup";
import { Timestamp } from "firebase/firestore";


export const getEventSchema = z
  .object({
    id: z.string(),
    flare_Id: z.string(),
    title: z.string(),
    description: z.string(),
    type: z.enum(eventTypeKeys).transform((key): eventTypeValue => eventType[key]),
    location: getLocationSchema,
    ageGroup: z.enum(ageGroupKeys).transform((key): ageGroupValue => AgeGroup[key]),
    startdate: z.instanceof(Timestamp).transform((ts) => ts.toDate()),
    endDate: z.instanceof(Timestamp).transform((ts) => ts.toDate()),
    price: z.union([z.string(), z.number()]),
    verified: z.boolean().optional().default(false),
    createdAt: z.instanceof(Timestamp).transform((ts) => ts.toDate()).optional(),
    ticketLink: z.url().optional(),
  })
  .transform((data): EventArgs => {
    return {
      flare_id: data.flare_Id,
      title: data.title,
      description: data.description,
      type: data.type,
      ageGroup: data.ageGroup,
      startDate: data.startdate,
      endDate: data.endDate,
      location: data.location,
      price: data.price,
      verified: data.verified,
      createdAt: data.createdAt,
      ticketLink: data.ticketLink,
      id: data.id
    };
  });