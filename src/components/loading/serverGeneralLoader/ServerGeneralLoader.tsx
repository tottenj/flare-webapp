"use server"

import SVGLogo from "@/components/flare/svglogo/SVGLogo";

export default async function ServerGeneralLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <SVGLogo spin={true} />
    </div>
  );
}
