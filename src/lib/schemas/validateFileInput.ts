export default function validateFileInput({
  file,
  options,
}: {
  file: File;
  options?: { maxSize?: number };
}) {
  const maxSizeMB = options?.maxSize ?? 5;
  if (!file.type.startsWith('image/')) {
    return 'Only image files are allowed';
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Image must be under ${maxSizeMB}MB`;
  }

  return null;
}
