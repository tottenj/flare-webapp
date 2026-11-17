import { OrganizationType } from '../../../../prisma/generated/enums';
import { z } from 'zod';

export const OrganizationTypeSchema = z.enum(OrganizationType);
export type OrganizationTypeValue = z.infer<typeof OrganizationTypeSchema>;
