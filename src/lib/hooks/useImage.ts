"use client"

import { useEffect, useState } from "react"

export default function useImage(success?:string, pending?:boolean) {
    const [img, setImg] = useState<File | null>(null)
    const [imgUrl, setImgUrl] = useState<string | null>(null)
    

    return {img, setImg, imgUrl, setImgUrl}


}