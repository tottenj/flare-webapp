import { ProofPlatform } from '@/lib/domain/ProofPlatform';
import { z } from 'zod';

export const ProofPlatformSchema = z.enum([
  ProofPlatform.INSTAGRAM,
  ProofPlatform.FACEBOOK,
  ProofPlatform.X,
  ProofPlatform.OTHER,
]);

export type ProofPlatformType = z.infer<typeof ProofPlatformSchema>;
