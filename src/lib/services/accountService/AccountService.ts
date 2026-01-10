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
    ensure(
      imageData.storagePath.startsWith(`users/${authenticatedUser.firebaseUid}/profile-pic`),
      AuthErrors.Unauthorized()
    );

    let oldStoragePath: string | null = null;
    try {
      await prisma.$transaction(async (tx) => {
        const imageAsset = await imageAssetDal.create(imageData, tx);
        const oldProfilePic = await profilePicDal.getByUserId(authenticatedUser.userId, tx);
        oldStoragePath = oldProfilePic?.imageAsset.storagePath ?? null;
        await profilePicDal.upsertForUser(authenticatedUser.userId, imageAsset.id, tx);
        if (oldProfilePic) await imageAssetDal.delete(oldProfilePic.imageAssetId, tx);
      });
      if (oldStoragePath) {
        // Best-effort cleanup of previous profile picture after DB commit
        //Purposefully not awaited
        ImageService.deleteByStoragePath(oldStoragePath).catch((err) => {
          logger.error('Failed to cleanup old profile picture from storage', {
            oldStoragePath,
            err,
          });
        });
      }
    } catch (err) {
      // Best-effort cleanup of newly uploaded file if DB write fails
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
