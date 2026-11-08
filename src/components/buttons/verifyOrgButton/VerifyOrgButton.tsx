'use client';
import { useFormAction } from '@/lib/hooks/useFormAction';
import verifyOrganization from '@/lib/serverActions/admin/verifyOrg/veirfyOrginization';
import { useRouter } from 'next/navigation';

export default function VerifyOrgButton({ orgId }: { orgId: string }) {
  const router = useRouter();
  const { action, pending, error } = useFormAction(verifyOrganization, {
    toast: {
      loading: 'Verifying organization...',
      success: 'Organization verified',
      error: 'Failed to verify organization',
    },
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <div data-cy="verify-org-container" className="flex flex-col gap-2">
      <button
        type="button"
        data-cy="verify-org-button"
        className="rounded-xl bg-neutral-900 px-4 py-2 text-white disabled:opacity-60"
        disabled={pending}
        onClick={() => action(orgId)}
      >
        {pending ? 'Verifying…' : 'Verify Organization'}
      </button>
      {error?.message ? (
        <p data-cy="verify-org-error" className="text-danger text-sm">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}
