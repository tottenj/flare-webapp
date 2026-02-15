import { imageAssetDal } from '@/lib/dal/imageAssetDal/ImageAssetDal';
import { profilePicDal } from '@/lib/dal/profiePicDal/ProfilePicDal';
import { AuthErrors } from '@/lib/errors/authError';
import ensure from '@/lib/errors/ensure/ensure';
import { logger } from '@/lib/logger';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import ImageService from '@/lib/services/imageService/ImageService';
import { prisma } from '../../../../prisma/prismaClient';
import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';

export default class AccountService {
  static async updateProfilePicture({
    imageData,
    authenticatedUser,
  }: {
    imageData: ImageMetadata;
    authenticatedUser: AuthenticatedUser;
  }) {
    let oldStoragePath: string | null = null;

    try {
      ensure(
        imageData.storagePath.startsWith(`users/${authenticatedUser.firebaseUid}/profile-pic/`),
        AuthErrors.Unauthorized()
      );
      await prisma.$transaction(async (tx) => {
        const imageAsset = await imageAssetDal.create(imageData, tx);
        const oldProfilePic = await profilePicDal.getByUserId(authenticatedUser.userId, tx);
        oldStoragePath = oldProfilePic?.imageAsset.storagePath ?? null;
        await profilePicDal.upsertForUser(authenticatedUser.userId, imageAsset.id, tx);
        if (oldProfilePic) {
          await imageAssetDal.delete(oldProfilePic.imageAssetId, tx);
        }
      });

      if (oldStoragePath && oldStoragePath !== imageData.storagePath) {
        await ImageService.deleteByStoragePath(oldStoragePath).catch((err) => {
          logger.error('Failed to cleanup old profile picture', {
            oldStoragePath,
            err,
          });
        });
      }
    } catch (err) {
      await ImageService.deleteByStoragePath(imageData.storagePath).catch(() => {});
      throw err;
    }
  }
}
