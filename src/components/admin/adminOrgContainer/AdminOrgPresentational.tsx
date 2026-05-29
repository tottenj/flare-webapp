import OrgCard from '@/components/org/orgCard/OrgCard';
import { AdminOrgDetailsViewModel } from '@/lib/schemas/admin/AdminOrgDetailsDto';
import { ReactNode } from 'react';

export default function AdminOrgPresentational({
  org,
  actions,
}: {
  org: AdminOrgDetailsViewModel;
  actions?: ReactNode;
}) {
  const hasSocials = Boolean(
    org.socials?.facebookHandle ||
    org.socials?.instagramHandle ||
    org.socials?.xHandle ||
    org.socials?.otherText
  );

  return (
    <div className="flex flex-col gap-6 p-2">
      <OrgCard name={org.orgName} location={org.location} profilePicturePath={org.profilePicPath} />
      <div>
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>{org.email}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Social Handles</h2>
        {!hasSocials && <p>No social handles provided.</p>}
        {hasSocials && (
          <ul className="list-disc pl-5">
            {org.socials?.instagramHandle && <li>Instagram: {org.socials.instagramHandle}</li>}
            {org.socials?.facebookHandle && <li>Facebook: {org.socials.facebookHandle}</li>}
            {org.socials?.xHandle && <li>X: {org.socials.xHandle}</li>}
            {org.socials?.otherText && <li>Other: {org.socials.otherText}</li>}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold">Proofs</h2>
        {org.proofs.length === 0 && <p>No proofs uploaded.</p>}
        {org.proofs.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {org.proofs.map((proof) => (
              <div key={proof.id} className="flex flex-col gap-2 rounded-md border p-3">
                <p className="font-medium">{proof.platform}</p>
                {proof.imageUrl ? (
                  <img
                    src={proof.imageUrl}
                    alt={`${proof.platform} proof`}
                    className="w-full rounded"
                  />
                ) : (
                  <p className="text-default-500 text-sm">Preview unavailable</p>
                )}
                <p className="text-default-500 text-xs break-all">{proof.storagePath}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {actions}
    </div>
  );
}
