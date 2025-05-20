"use client"
import PrimaryButton from "@/components/buttons/primaryButton/PrimaryButton";
import { signOutUser } from "@/lib/firebase/auth/signOutUser";
import Image from "next/image";
import { useRouter } from "next/navigation";
interface logoWithTextProps{
    size: number
}
export default function LogoWithText({size}:logoWithTextProps) {
  const router = useRouter()

  return (
    <div onClick={() => router.push("/")} className="flex flex-row items-center gap-4 cursor-pointer">
        <PrimaryButton click={signOutUser} text="sign out" size="small"/>
        <Image src={"/Flare.png"}  width={size} height={size} alt="flare logo"/>
        <div className="flex flex-col font-nunito text-xl font-black">
        <p className="text-3xl mb-0">Flare</p>
        <p className="text-orange">Ignite Community</p>
        </div>
    </div>
  )
}