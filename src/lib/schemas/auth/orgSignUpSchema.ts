import { AuthTokenSchema } from '@/lib/schemas/auth/signUpSchema';
import { LocationInputSchema } from '@/lib/schemas/LocationInputSchema';
import { ImageMetadataSchema } from '@/lib/schemas/proof/ImageMetadata';

import { ProofPlatformSchema } from '@/lib/schemas/proof/ProofPlatformSchema';
import z from 'zod';

export const OrgSignUpSchema = AuthTokenSchema.extend({
  org: z.object({
    name: z.string().min(1, 'Organization name is required'),
    email: z.email(),
    location: LocationInputSchema,
  }),
  socials: z
    .array(
      z.object({
        platform: ProofPlatformSchema,
        handle: z.string().min(1),
      })
    )
    .optional(),
  proofs: z.array(ImageMetadataSchema).optional(),
});

export type OrgSignUpInput = z.infer<typeof OrgSignUpSchema>;
