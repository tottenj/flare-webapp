import { Prisma } from '@prisma/client';
import deepMerge from '../utils/deepMerge';

let counter = 1;
function buildBaseImage(storagePath: string): Prisma.ImageAssetCreateInput {
  return {
    storagePath: storagePath,
    contentType: 'jpg',
    sizeBytes: 1,
    originalName: `${counter}.jpg`,
  };
}

export async function createImageIntegration(params: {
  storagePath: string;
  overrides?: Partial<Prisma.ImageAssetCreateInput>;
}) {
  const data = deepMerge(buildBaseImage(params.storagePath), params.overrides);
  return await prisma.imageAsset.create({ data });
}
