import { LocationInputSchema } from '@/lib/schemas/LocationInputSchema';
import z from 'zod';
import { SOCIAL_CONFIG } from '@/lib/utils/socialConfig';

export const orgDetailsSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  location: LocationInputSchema.optional(),
  description: z.string().min(1, 'Description is required'),
});

export const orgContactSchema = z.object({
  email: z.email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  website: z.url('Invalid URL').min(1, 'Website is required').optional(),
});

export const orgSocialProofSchema = z.object({
  socialProofType: z.enum(['other', ...Object.keys(SOCIAL_CONFIG)] as [string, ...string[]]),
  socialProofDetails: z.string().trim().min(1, 'Enter a link, handle, or explanation'),
  socialProofFile: z
    .file()
    .max(5 * 1024 * 1024, 'Maximum file size is 5 MB')
    .mime(['image/jpeg', 'image/png', 'application/pdf'], 'Upload a JPG, PNG, or PDF')
    .optional(),
});

export const orgCreateSchema = z.object({
  ...orgDetailsSchema.shape,
  ...orgContactSchema.shape,
  ...orgSocialProofSchema.shape,
});

export const steps: { title: string; fields: readonly orgCreateFields[] }[] = [
  { title: 'Organization Details', fields: orgDetailsSchema.keyof().options },
  { title: 'Contact Information', fields: orgContactSchema.keyof().options },
  { title: 'Social Proof', fields: orgSocialProofSchema.keyof().options },
];

export function isOrgCreateField(name: string): name is orgCreateFields {
  return orgCreateSchema.keyof().safeParse(name).success;
}

// Index of the first step that contains one of these fields, or -1.
export function firstStepWith(names: string[]) {
  return steps.findIndex((step) => step.fields.some((field) => names.includes(field)));
}

export type orgCreateValues = z.infer<typeof orgCreateSchema>;
export type orgCreateFields = keyof orgCreateValues;
