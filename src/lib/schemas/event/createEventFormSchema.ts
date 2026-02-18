import { CreateEventBaseSchema } from '@/lib/schemas/event/eventBaseSchema';
import { ImageMetadataSchema } from '@/lib/schemas/proof/ImageMetadata';
import z from 'zod';

export const CreateEventSchema = CreateEventBaseSchema.extend({
  image: ImageMetadataSchema,
  status: z.enum(['DRAFT', 'PUBLISHED'])
});

export type CreateEvent = z.infer<typeof CreateEventSchema>;
