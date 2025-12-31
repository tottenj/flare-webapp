'use server';
import Image from 'next/image';

interface profilePictureProps {
  size: number;
  src?: string;
}

export default async function ProfilePicture({ size, src }: profilePictureProps) {
  let retval = src ?? '/defaultProfile.svg';

  
  return (
    <div className="relative overflow-hidden rounded-full" style={{ width: size, height: size }}>
      <Image src={retval} alt="profile" fill className="object-cover" />
    </div>
  );
}
