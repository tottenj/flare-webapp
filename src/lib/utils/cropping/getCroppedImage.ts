// lib/utils/cropping/getCroppedImage.ts
export async function getCroppedImg(
  imageSrc: string,
  croppedAreaPixels: { x: number; y: number; width: number; height: number },
  rotation = 0,
  fileName = 'cropped.jpg',
  outputWidth = 300
): Promise<File> {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No canvas context');

  // calculate output height from aspect ratio
  const aspect = croppedAreaPixels.width / croppedAreaPixels.height;
  const outputHeight = Math.round(outputWidth / aspect);

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  // filename handling
  const [name, ext] = fileName.split(/\.(?=[^\.]+$)/);
  const finalName = `${name || 'image'}_cropped_${Date.now()}.${ext || 'jpg'}`;

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas empty'));
      resolve(new File([blob], finalName, { type: 'image/jpeg' }));
    }, 'image/jpeg');
  });
}
