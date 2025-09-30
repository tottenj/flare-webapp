import { z } from 'zod';
import { eventTypeKeys }  from '@/lib/enums/eventType';

export const eventTypeSchema = z.enum(eventTypeKeys);
