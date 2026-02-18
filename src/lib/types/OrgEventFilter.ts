import { EventStatus } from "@prisma/client";
import z from "zod";

export const OrgEventFilterSchema = z.object({
  status: z.enum(EventStatus).optional(),
});

export type OrgEventFilter = z.infer<typeof OrgEventFilterSchema>;
