import Link from "next/link";
import { CSSProperties } from "react";

interface linkInputProps{
    href:string
    style?:CSSProperties
    text:string
}

export default function LinkInput({href, style, text}:linkInputProps) {
  return (
    <Link
      className="bg-primary font-nunito hover:text-primary border-primary rounded-2xl border-2 p-1 font-bold text-white ease-in-out hover:bg-white"
      href={href}
      style={style}
    >
      {text}
    </Link>
  );
}