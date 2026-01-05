import { imageAssetDal } from '@/lib/dal/imageAssetDal/ImageAssetDal';
import { profilePicDal } from '@/lib/dal/profiePicDal/ProfilePicDal';
import { AuthErrors } from '@/lib/errors/authError';
import ensure from '@/lib/errors/ensure/ensure';
import { logger } from '@/lib/logger';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import ImageService from '@/lib/services/imageService/ImageService';
import { prisma } from '../../../../prisma/prismaClient';

export default class AccountService {
  static async updateProfilePicture({
    imageData,
    userId,
    firebaseUid,
  }: {
    imageData: ImageMetadata;
    userId: string;
    firebaseUid: string;
  }) {
    ensure(
      imageData.storagePath.startsWith(`users/${firebaseUid}/profile-pic`),
      AuthErrors.Unauthorized()
    );

    try {
      await prisma.$transaction(async (tx) => {
        const imageAsset = await imageAssetDal.create(imageData, tx);
        await profilePicDal.upsertForUser(userId, imageAsset.id, tx);
      });
    } catch (err) {
      await ImageService.deleteByStoragePath(imageData.storagePath).catch((err) => {
        logger.error('Failed to cleanup profile picture from storage', {
          storagePath: imageData.storagePath,
          err,
        });
      });
      throw err;
    }
  }
}
