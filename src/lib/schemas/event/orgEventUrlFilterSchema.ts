import z from 'zod';

export const OrgEventUrlFilterSchema = z.object({
  status: z.enum(['published', 'draft']).default("published"),
});

export type OrgEventUrlFilters = z.infer<typeof OrgEventUrlFilterSchema>;
