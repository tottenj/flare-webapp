"use client"
import { useRouter } from "next/navigation";
import Logo from "../logo/Logo";
interface logoWithTextProps{
    size: number
}
export default function LogoWithText({size}:logoWithTextProps) {
  const router = useRouter()

  return (
    <div onClick={() => router.push("/")} className="flex flex-row items-center gap-4 cursor-pointer w-fit">
        <Logo size={size}/>
        <div className="flex flex-col font-nunito text-xl font-black">
        <p className="text-3xl mb-0">Flare</p>
        <p className="text-orange">Ignite Community</p>
        </div>
    </div>
  )
}