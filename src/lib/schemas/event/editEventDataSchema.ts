import { LocationInputSchema } from '@/lib/schemas/LocationInputSchema';
import { eventDtoSchema, type EventDto } from '@/lib/schemas/event/eventDtoSchema';
import { ImageMetadataSchema } from '@/lib/schemas/proof/ImageMetadata';
import z from 'zod';

export const editEventDataSchema = z.object({
  event: eventDtoSchema,
  location: LocationInputSchema.optional(),
  imageUrl: z.string().optional(),
  imageMetadata: ImageMetadataSchema.optional(),
});

type EditEventDataParsed = z.infer<typeof editEventDataSchema>;

export type EditEventData = Omit<EditEventDataParsed, 'event'> & {
  event: EventDto;
};
