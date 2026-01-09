import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import { Prisma, ProofPlatform as PrismaProofPlatform } from '@prisma/client';
import { prisma } from '../../../../prisma/prismaClient';
import { ProofPlatform as DomainProofPlatform } from '@/lib/domain/ProofPlatform';
import { ProofImageMetadata } from '@/lib/schemas/proof/ProofImageMetadataSchema';

function toPrismaProofPlatform(platform?: DomainProofPlatform): PrismaProofPlatform {
  if (!platform) return 'OTHER';
  return PrismaProofPlatform[platform];
}

export class OrgProofDal {
  async create(orgId: string, input: ProofImageMetadata[], tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;

    const ops = input.map((proof) =>
      client.imageAsset.create({
        data: {
          storagePath: proof.storagePath,
          contentType: proof.contentType!,
          sizeBytes: proof.sizeBytes!,
          originalName: proof.originalName,
          orgProofFiles: {
            create: {
              organizationId: orgId,
              platform: toPrismaProofPlatform(proof.platform),
            },
          },
        },
      })
    );
    return Promise.all(ops);
  }
}

export const orgProofDal = new OrgProofDal();
