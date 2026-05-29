import { AdminService } from '@/lib/services/adminService/AdminService';
import {
  AdminOrgDetailsViewModel,
  AdminOrgProof,
  AdminOrgProofWithImageUrl,
} from '@/lib/schemas/admin/AdminOrgDetailsDto';
import ImageService from '@/lib/services/imageService/ImageService';
import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';
import AdminOrgPresentational from '@/components/admin/adminOrgContainer/AdminOrgPresentational';
import VerifyOrgButton from '@/components/buttons/verifyOrgButton/VerifyOrgButton';

async function mapProofsWithUrls(proofs: AdminOrgProof[]): Promise<AdminOrgProofWithImageUrl[]> {
  return await Promise.all(
    proofs.map(async (proof) => {
      let imageUrl: string | null = null;
      try {
        imageUrl = await ImageService.getDownloadUrl(proof.storagePath);
      } catch {
        imageUrl = null;
      }

      return {
        id: proof.id,
        platform: proof.platform,
        storagePath: proof.storagePath,
        createdAt: proof.createdAt,
        imageUrl,
      };
    })
  );
}

export default async function AdminOrgContainer({
  orgId,
  actor,
}: {
  orgId: string;
  actor: AuthenticatedUser;
}) {
  const orgDetails = await AdminService.getUnverifiedOrgDetails(actor, orgId);
  if (!orgDetails) {
    return <div>Organization not found in pending queue.</div>;
  }

  const proofs = await mapProofsWithUrls(orgDetails.proofs);
  const viewModel: AdminOrgDetailsViewModel = {
    ...orgDetails,
    proofs,
  };

  return (
    <AdminOrgPresentational org={viewModel} actions={<VerifyOrgButton orgId={viewModel.id} />} />
  );
}
