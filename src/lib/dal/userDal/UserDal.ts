import 'server-only';
import { UniqueConstraintError } from '../../errors/DalErrors';
import { prisma } from '../../../../prisma/prismaClient';
import { DeletedImageAsset } from '@/lib/dal/imageAssetDal/ImageAssetDal';
import { Prisma, User } from '../../../../prisma/generated/client';

export class UserDal {
  async findByFirebaseUid(
    firebaseUid: string,
    tx?: Prisma.TransactionClient
  ): Promise<User | null> {
    const client = tx ?? prisma;
    return await client.user.findUnique({
      where: { firebaseUid },
    });
  }

  async findContextByFirebaseUid(firebaseUid: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    return await client.user.findUnique({
      where: { firebaseUid },
      include: {
        organizationMemberships: {
          orderBy: [{ createdAt: 'asc' }, { organizationId: 'asc' }],
          select: {
            role: true,
            organization: {
              select: { id: true, orgName: true, status: true, locationId: true },
            },
          },
        },
        profilePic: {
          include: { imageAsset: true },
        },
      },
    });
  }

  async create(input: Prisma.UserCreateInput, tx?: Prisma.TransactionClient): Promise<User> {
    if (tx) return await tx.user.create({ data: input });
    return await prisma.user.create({ data: input });
  }

  async createIfNotExists(
    input: Prisma.UserCreateInput,
    tx?: Prisma.TransactionClient
  ): Promise<User> {
    const client = tx ?? prisma;

    const existing = await this.findByFirebaseUid(input.firebaseUid, client);
    if (existing) return existing;

    try {
      return await client.user.create({ data: input });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new UniqueConstraintError('User already exists');
      }
      throw e;
    }
  }

  async markActive(firebaseUid: string): Promise<User> {
    return await prisma.user.update({
      where: { firebaseUid },
      data: {
        status: 'ACTIVE',
      },
    });
  }

  async deleteUser(userId: string, tx?: Prisma.TransactionClient): Promise<DeletedImageAsset[]> {
    if (!tx) {
      return prisma.$transaction((client) => this.deleteUser(userId, client));
    }

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        profilePic: {
          select: { imageAssetId: true },
        },
      },
    });
    if (!user) return [];

    // Delete only organizations where this user is the sole member and owns the organization.
    const soleOwner = {
      members: {
        some: { userId, role: 'OWNER' },
        every: { userId },
      },
    } satisfies Prisma.OrganizationProfileWhereInput;
    const organizations = await tx.organizationProfile.findMany({
      where: soleOwner,
      select: {
        id: true,
        proofs: { select: { imageAssetId: true } },
        events: { select: { imageId: true } },
      },
    });

    const assetIds: string[] = [];
    if (user.profilePic) assetIds.push(user.profilePic.imageAssetId);
    for (const organization of organizations) {
      const deleted = await tx.organizationProfile.deleteMany({
        where: { id: organization.id, ...soleOwner },
      });
      if (deleted.count === 0) continue;
      assetIds.push(...organization.proofs.map(({ imageAssetId }) => imageAssetId));
      for (const { imageId } of organization.events) {
        if (imageId) assetIds.push(imageId);
      }
    }

    await tx.user.delete({ where: { id: userId } });

    if (assetIds.length === 0) return [];

    return tx.imageAsset.findMany({
      where: {
        id: { in: assetIds },
        profilePics: { none: {} },
        orgProofFiles: { none: {} },
        events: { none: {} },
      },
      select: { id: true, storagePath: true },
    });
  }
}

export const userDal = new UserDal();
