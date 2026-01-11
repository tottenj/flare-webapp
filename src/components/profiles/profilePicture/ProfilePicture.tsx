import Image from 'next/image';
interface profilePictureProps {
  size: number;
  src?: string;
}

export default function ProfilePicture({ size, src }: profilePictureProps) {
  let retval = src ?? '/defaultProfile.svg';

  return (
    <div className="relative overflow-hidden rounded-full" style={{ width: size, height: size }}>
      <Image
        data-cy="profile-picture"
        unoptimized
        src={retval}
        alt="profile"
        fill
        className="object-cover"
      />
    </div>
  );
}
