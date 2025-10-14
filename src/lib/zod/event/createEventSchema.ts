import { z } from 'zod';
import { getLocationSchema } from '../location/getLocationSchema';
import eventType from '@/lib/enums/eventType';
import { eventTypeSchema } from './eventTypeSchema';

export const CreateEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  start: z.preprocess((val) => {
    if (typeof val === 'string') {
      return new Date(val.replace(/\[.*\]$/, ''));
    }
    return val;
  }, z.date()),
  end: z.preprocess((val) => {
    if (typeof val === 'string') {
      return new Date(val.replace(/\[.*\]$/, ''));
    }
    return val;
  }, z.date()),
  location: getLocationSchema,
  price: z.coerce.number(),
  tickets: z
  .string()
  .url("Must be a valid URL")
  .optional()
  .or(z.literal("")),
  type: eventTypeSchema,
  age: z.any(),
}).transform((data) => {
  return{
    title: data.title,
    description: data.description,
    type: data.type,
    ageGroup: data.age,
    startDate: data.start,
    endDate: data.end,
    location: data.location,
    price: data.price,
    ticketLink: data.tickets,
  }
});
