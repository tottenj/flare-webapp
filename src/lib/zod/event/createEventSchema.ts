import AgeGroup from '@/lib/enums/AgeGroup';
import eventType from '@/lib/enums/eventType';
import { z } from 'zod';

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
  location: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return undefined;
        }
      }
      return val;
    },
    z.object({
      id: z.string(),
      name: z.string(),
      coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    })
  ),
  price: z.coerce.number(),
  tickets: z.string().optional(),
  type: z.any(),
  age: z.any(),
});
