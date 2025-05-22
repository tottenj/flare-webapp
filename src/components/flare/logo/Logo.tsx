import Image from "next/image";

interface logoProps{
    size: number
}
export default function Logo({size}: logoProps) {
  return (
    <Image src={"/Flare.png"}  width={size} height={size} alt="flare logo"/>
  )
}