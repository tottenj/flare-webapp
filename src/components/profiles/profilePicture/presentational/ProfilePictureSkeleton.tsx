export default function ProfilePictureSkeleton({ size }: { size: number }) {
  return <div className="bg-content3 animate-pulse rounded-full aspect-square" style={{ width: size, height: size }} />;
}
