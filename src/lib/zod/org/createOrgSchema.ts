import z from "zod";
import { getLocationSchema } from "../location/getLocationSchema";

export const OrgSignUpFormSchema = z
  .object({
    orgName: z.string().min(2, 'name must be at least 2 characters'),
    email: z.email(),
    location: getLocationSchema,
    password: z.string(),
    confirmPassword: z.string(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    other: z.string().optional(),
    'instagram-file': z.file().optional(),
    'twitter-file': z.file().optional(),
    'facebook-file': z.file().optional(),
    'other-file': z.file().optional(),
  })
  .strict();