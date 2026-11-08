export default function VerifyOrgButton({
  orgId,
  error,
}: {
  orgId: string;
  error?: { message: string };
}) {
  return (
    <div className="flex flex-col gap-2">
      <button type="button" className="rounded-xl bg-neutral-900 px-4 py-2 text-white">
        Verify Organization
      </button>
      {error?.message ? <p className="text-danger text-sm">{error.message}</p> : null}
    </div>
  );
}
