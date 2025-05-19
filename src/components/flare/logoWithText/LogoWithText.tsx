import Image from "next/image";


interface logoWithTextProps{
    size: number
}
export default async function LogoWithText({size}:logoWithTextProps) {
  return (
    <div className="flex flex-row items-center gap-4">
        <Image src={"/Flare.png"}  width={size} height={size} alt="flare logo"/>
        <div className="flex flex-col font-nunito text-xl font-black">
        <p className="text-3xl mb-0">Flare</p>
        <p className="text-orange">Ignite Community</p>
        </div>
    </div>
  )
}