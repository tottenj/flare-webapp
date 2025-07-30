import SVGLogo from "@/components/flare/svglogo/SVGLogo";

export default function loading() {
  return (
    <div className="flex justify-center items-center w-dvw h-dvh">
      <SVGLogo color={'#fff'} size={150} spin={true} />
    </div>
  )
}