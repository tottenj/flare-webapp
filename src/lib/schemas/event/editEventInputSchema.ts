import { CreateEventBaseSchema } from '@/lib/schemas/event/eventBaseSchema';
import { ImageMetadataSchema } from '@/lib/schemas/proof/ImageMetadata';
import z from 'zod';

export const EditEventInputSchema = CreateEventBaseSchema.extend({
  image: z.discriminatedUnion('isNew', [
    z.object({ isNew: z.literal(true), metadata: ImageMetadataSchema }),
    z.object({ isNew: z.literal(false), storagePath: z.string() }),
  ]),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

export type EditEventInput = z.infer<typeof EditEventInputSchema>;
