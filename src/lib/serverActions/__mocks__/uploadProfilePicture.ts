import { ImageMetadata } from "@/lib/schemas/proof/ImageMetadata";

export default async function uploadProfilePicture(imageData: ImageMetadata) {
  return { ok: true, data: null };
}
