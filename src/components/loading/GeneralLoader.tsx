import SVGLogo from "../flare/svglogo/SVGLogo";

export default function GeneralLoader({size, color}: {size?:string, color?:string}) {
  return (
    <div className="flex justify-center items-center w-full h-full"><SVGLogo size={size} color={color}  spin={true} /></div>
  )
}