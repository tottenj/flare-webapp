import { ProofPlatform } from '@prisma/client';
import { z } from 'zod';

export const ProofPlatformSchema = z.enum([
  ProofPlatform.INSTAGRAM,
  ProofPlatform.FACEBOOK,
  ProofPlatform.X,
  ProofPlatform.OTHER,
]);

export type ProofPlatformType = z.infer<typeof ProofPlatformSchema>;
