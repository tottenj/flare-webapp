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
  members: {
    where: { role: 'OWNER' },
    orderBy: [{ createdAt: 'asc' }, { userId: 'asc' }],
    take: 1,
    select: {
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
    },
  },
} satisfies Prisma.OrganizationProfileInclude;

export function mapOrgCardRowToDto(row: OrgCardRow): OrgCardDto {
  return {
    id: row.id,
    orgName: row.orgName,
    location: row.location?.address ?? null,
    profilePicPath: row.members[0]?.user.profilePic?.imageAsset.storagePath ?? null,
  };
}
