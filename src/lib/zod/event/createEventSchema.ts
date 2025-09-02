import { EventArgs } from '@/lib/classes/event/Event';
import AgeGroup from '@/lib/enums/AgeGroup';
import eventType from '@/lib/enums/eventType';
import { z } from 'zod';
import { getLocationSchema } from '../location/getLocationSchema';

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
  tickets: z.string().optional(),
  type: z.any(),
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
