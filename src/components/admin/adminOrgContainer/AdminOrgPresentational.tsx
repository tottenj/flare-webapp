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
    <div data-cy="admin-org-details" className="flex flex-col gap-6 p-2">
      <OrgCard
        name={org.orgName}
        location={org.location}
        profilePicturePath={org.profilePicPath}
        dataCy="admin-org-details-card"
      />
      <div data-cy="admin-org-contact-section">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p data-cy="admin-org-contact-email">{org.email}</p>
      </div>

      <div data-cy="admin-org-socials-section">
        <h2 className="text-xl font-semibold">Social Handles</h2>
        {!hasSocials && <p data-cy="admin-org-no-socials">No social handles provided.</p>}
        {hasSocials && (
          <ul data-cy="admin-org-socials-list" className="list-disc pl-5">
            {org.socials?.instagramHandle && (
              <li data-cy="admin-org-social-instagram">Instagram: {org.socials.instagramHandle}</li>
            )}
            {org.socials?.facebookHandle && (
              <li data-cy="admin-org-social-facebook">Facebook: {org.socials.facebookHandle}</li>
            )}
            {org.socials?.xHandle && <li data-cy="admin-org-social-x">X: {org.socials.xHandle}</li>}
            {org.socials?.otherText && (
              <li data-cy="admin-org-social-other">Other: {org.socials.otherText}</li>
            )}
          </ul>
        )}
      </div>

      <div data-cy="admin-org-proofs-section">
        <h2 className="text-xl font-semibold">Proofs</h2>
        {org.proofs.length === 0 && <p data-cy="admin-org-no-proofs">No proofs uploaded.</p>}
        {org.proofs.length > 0 && (
          <div data-cy="admin-org-proofs-grid" className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {org.proofs.map((proof) => (
              <div
                key={proof.id}
                data-cy={`admin-org-proof-${proof.id}`}
                className="flex flex-col gap-2 rounded-md border p-3"
              >
                <p data-cy={`admin-org-proof-platform-${proof.id}`} className="font-medium">
                  {proof.platform}
                </p>
                {proof.imageUrl ? (
                  <img
                    src={proof.imageUrl}
                    alt={`${proof.platform} proof`}
                    className="w-full rounded"
                    data-cy={`admin-org-proof-image-${proof.id}`}
                  />
                ) : (
                  <p
                    data-cy={`admin-org-proof-no-image-${proof.id}`}
                    className="text-default-500 text-sm"
                  >
                    Preview unavailable
                  </p>
                )}
                <p
                  data-cy={`admin-org-proof-storage-path-${proof.id}`}
                  className="text-default-500 text-xs break-all"
                >
                  {proof.storagePath}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {actions}
    </div>
  );
}
