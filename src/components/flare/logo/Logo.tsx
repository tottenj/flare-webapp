import Image from "next/image";
import SVGLogo from "../svglogo/SVGLogo";

interface logoProps{
    size: number
}
export default function Logo({size}: logoProps) {
  return (
    <SVGLogo size={size}/>
  )
}