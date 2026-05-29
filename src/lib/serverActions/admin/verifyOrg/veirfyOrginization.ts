'use server';
import { AppError } from '@/lib/errors/AppError';
import { extractFieldErrors } from '@/lib/errors/extractError';
import fail from '@/lib/errors/fail';
import { GeneralErrors } from '@/lib/errors/GeneralErrors';
import { AdminService } from '@/lib/services/adminService/AdminService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { ActionResult } from '@/lib/types/responses/ActionResult';
import z from 'zod';

export default async function verifyOrganization(orgId: string): Promise<ActionResult<null>> {
  const ctx = await UserContextService.requireAdmin();
  const actor = UserContextService.getUserActor(ctx);
  const sanitized = z
    .object({
      orgId: z.string(),
    })
    .safeParse({ orgId });

  if (!sanitized.success) {
    const fieldErrors = extractFieldErrors(z.treeifyError(sanitized.error));
    return fail(GeneralErrors.InvalidFileInput(), fieldErrors);
  }

  try {
    await AdminService.verifyOrg(actor, sanitized.data.orgId);
    return { ok: true, data: null };
  } catch (error) {
    if (error instanceof AppError) {
      return fail(error);
    }
    return fail(GeneralErrors.Unknown());
  }
}
