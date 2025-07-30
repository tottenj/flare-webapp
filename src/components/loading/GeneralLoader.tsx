import SVGLogo from "../flare/svglogo/SVGLogo";

export default function GeneralLoader({size}: {size?:string}) {
  return (
    <div className="flex justify-center items-center w-full h-full"><SVGLogo size={size} spin={true} /></div>
  )
}