import { AdminOrgDetailsDto } from '@/lib/schemas/admin/AdminOrgDetailsDto';
import { Prisma } from '../../../../../prisma/generated/client';

export type AdminOrgRow = Prisma.OrganizationProfileGetPayload<{
  include: typeof adminOrgRowInclude;
}>;

export const adminOrgRowInclude = {
  location: {
    select: {
      address: true,
    },
  },
  proofs: {
    include: {
      imageAsset: {
        select: {
          storagePath: true,
        },
      },
    },
  },
  user: {
    select: {
      email: true,
      profilePic: {
        select: {
          imageAsset: {
            select: {
              storagePath: true,
            },
          },
        },
      },
    },
  },
  socials: {
    select: {
      facebookHandle: true,
      instagramHandle: true,
      xHandle: true,
      otherText: true,
    },
  },
} satisfies Prisma.OrganizationProfileInclude;

export function mapAdminOrgRowToDto(row: AdminOrgRow): AdminOrgDetailsDto {
  return {
    id: row.id,
    orgName: row.orgName,
    email: row.user.email,
    location: row.location.address,
    profilePicPath: row.user.profilePic?.imageAsset.storagePath ?? null,
    socials: row.socials
      ? {
          facebookHandle: row.socials.facebookHandle ?? null,
          instagramHandle: row.socials.instagramHandle ?? null,
          xHandle: row.socials.xHandle ?? null,
          otherText: row.socials.otherText ?? null,
        }
      : null,
    proofs: row.proofs.map((proof) => ({
      id: proof.id,
      platform: proof.platform,
      storagePath: proof.imageAsset.storagePath,
      createdAt: proof.createdAt,
    })),
  };
}
