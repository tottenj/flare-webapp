import { ProofPlatform } from '../../../../prisma/generated/enums';
import z from 'zod';

const AdminOrgProofSchema = z.object({
  id: z.string(),
  platform: z.enum(ProofPlatform),
  storagePath: z.string(),
  createdAt: z.date(),
});

export const AdminOrgSocialsSchema = z.object({
  facebookHandle: z.string().nullable(),
  instagramHandle: z.string().nullable(),
  xHandle: z.string().nullable(),
  otherText: z.string().nullable(),
});

export const AdminOrgDetailsSchema = z.object({
  id: z.string(),
  orgName: z.string(),
  email: z.string(),
  location: z.string().nullable(),
  profilePicPath: z.string().nullable(),
  socials: AdminOrgSocialsSchema.nullable(),
  proofs: z.array(AdminOrgProofSchema),
});

export type AdminOrgDetailsDto = z.infer<typeof AdminOrgDetailsSchema>;
export type AdminOrgSocials = z.infer<typeof AdminOrgSocialsSchema>;
export type AdminOrgProof = z.infer<typeof AdminOrgProofSchema>;
export type AdminOrgProofWithImageUrl = AdminOrgProof & {
  imageUrl: string | null;
};

export type AdminOrgDetailsViewModel = Omit<AdminOrgDetailsDto, 'proofs'> & {
  proofs: AdminOrgProofWithImageUrl[];
};
