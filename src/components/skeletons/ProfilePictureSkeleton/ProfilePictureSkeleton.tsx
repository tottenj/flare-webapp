export default function ProfilePictureSkeleton({ size }: { size: number }) {
  return <div className="bg-tertiary animate-pulse rounded-full" style={{ width: size, height: size }} />;
}
