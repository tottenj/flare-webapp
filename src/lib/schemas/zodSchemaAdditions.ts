import { parseZonedDateTime } from '@internationalized/date';
import z from 'zod';

export const ZonedDateTimeString = z.string().refine((val) => {
  try {
    parseZonedDateTime(val);
    return true;
  } catch {
    return false;
  }
}, 'Invalid datetime');
