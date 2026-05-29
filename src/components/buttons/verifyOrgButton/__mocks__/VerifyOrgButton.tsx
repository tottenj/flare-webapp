import { Button } from '@heroui/react';

export default function VerifyOrgButton({
  orgId,
  error,
}: {
  orgId: string;
  error?: { message: string };
}) {
  return (
    <div className="flex flex-col gap-2">
      <Button className="bg-primary">Verify Organization</Button>
      {error?.message ? <p className="text-danger text-sm">{error.message}</p> : null}
    </div>
  );
}
