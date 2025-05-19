import Image from "next/image";

interface profilePictureProps{
  size: number
}

export default async function ProfilePicture({size}: profilePictureProps) {

  return (
    <Image src={"/defaultProfile.svg"} width={size} height={size} alt="profile" className="rounded-full"/>
  )
}