import { logger } from "@/lib/logger";
import ImageService from "@/lib/services/imageService/ImageService";

export default async function cleanupUploadedImageOnFailure(input: unknown, firebaseUid: string) {
  const maybeImage = (input as any)?.image;

  if (maybeImage?.isNew && maybeImage?.metadata?.storagePath) {
    const path = maybeImage.metadata.storagePath;

    if (path.startsWith(`events/${firebaseUid}`)) {
      await ImageService.deleteByStoragePath(path).catch((error) => {
        logger.error('STORAGE_ERROR', { error });
      });
    }
  }
}
