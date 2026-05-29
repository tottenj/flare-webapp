'use client';
import { useFormAction } from '@/lib/hooks/useFormAction';
import verifyOrganization from '@/lib/serverActions/admin/verifyOrg/veirfyOrginization';
import { Button } from '@heroui/react';
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
      <Button
        data-cy="verify-org-button"
        className="bg-foreground text-background"
        isLoading={pending}
        isDisabled={pending}
        onPress={() => action(orgId)}
      >
        Verify Organization
      </Button>
      {error?.message ? (
        <p data-cy="verify-org-error" className="text-danger text-sm">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}
