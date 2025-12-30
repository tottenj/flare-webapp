import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import { Prisma, ProofPlatform as PrismaProofPlatform } from '@prisma/client';
import { prisma } from '../../../../prisma/prismaClient';
import { ProofPlatform as DomainProofPlatform } from '@/lib/domain/ProofPlatform';

function toPrismaProofPlatform(platform?: DomainProofPlatform): PrismaProofPlatform{
  if (!platform) return 'OTHER';
  return PrismaProofPlatform[platform];
}

export class OrgProofDal {
  async create(orgId: string, input: ImageMetadata[], tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;

    return client.orgProofFile.createMany({
      data: input.map((proof) => ({
        organizationId: orgId,
        platform: toPrismaProofPlatform(proof.platform),
        storagePath: proof.storagePath,
        contentType: proof.contentType,
        sizeBytes: proof.sizeBytes,
        originalName: proof.originalName,
      })),
    });
  }
}

export const orgProofDal = new OrgProofDal();
