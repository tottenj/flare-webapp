import { OrgCardDto } from '@/lib/schemas/org/OrgCardDtoSchema';
import { Prisma } from '../../../../../prisma/generated/client';

export type OrgCardRow = Prisma.OrganizationProfileGetPayload<{
  include: typeof OrgCardInclude;
}>;

export const OrgCardInclude = {
  location: {
    select: {
      address: true,
    },
  },
  user: {
    select: {
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
} satisfies Prisma.OrganizationProfileInclude;

export function mapOrgCardRowToDto(row: OrgCardRow): OrgCardDto {
  return {
    id: row.id,
    orgName: row.orgName,
    location: row.location.address,
    profilePicPath: row.user.profilePic?.imageAsset.storagePath ?? null,
  };
}
