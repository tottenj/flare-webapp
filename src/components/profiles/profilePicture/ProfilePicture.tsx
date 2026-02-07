import ProfilePictureSkeleton from '@/components/skeletons/ProfilePictureSkeleton/ProfilePictureSkeleton';
import Image from 'next/image';

interface profilePictureProps {
  size: number;
  src?: string;
  priority?: boolean;
}

export default function ProfilePicture({ size, src, priority }: profilePictureProps) {
  let retval = src ?? '/defaultProfile.svg';
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <>
      <div className="relative overflow-hidden rounded-full" style={{ width: size, height: size }}>
        <Image
          data-cy="profile-picture"
          loading="eager"
          priority={priority}
          src={retval}
          alt="profile"
          fill
          className="object-cover"
          blurDataURL=""
          unoptimized={isDev}
        />
      </div>
    </>
  );
}
