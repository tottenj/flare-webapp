import { CreateEventBaseSchema } from '@/lib/schemas/event/eventBaseSchema';
import { ImageMetadataSchema } from '@/lib/schemas/proof/ImageMetadata';
import z from 'zod';

export const CreateEventFormSchema = CreateEventBaseSchema.extend({
  image: ImageMetadataSchema,
});

export type CreateEventForm = z.infer<typeof CreateEventFormSchema>;
