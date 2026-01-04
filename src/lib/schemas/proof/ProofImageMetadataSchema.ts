import { ImageMetadataSchema } from '@/lib/schemas/proof/ImageMetadata';
import { ProofPlatformSchema } from '@/lib/schemas/proof/ProofPlatformSchema';
import z from 'zod';

export const ProofImageMetadataSchema = ImageMetadataSchema.extend({
  platform: ProofPlatformSchema.optional(),
});

export type ProofImageMetadata = z.infer<typeof ProofImageMetadataSchema>;
