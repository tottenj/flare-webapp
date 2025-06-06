"use client"
import { httpsCallable } from "firebase/functions";
import PrimaryButton from "../primaryButton/PrimaryButton";
import { functions } from "@/lib/firebase/auth/configs/clientApp";
import { useState } from "react";
import { useActionToast } from "@/lib/hooks/useActionToast/useActionToast";
import { useRouter } from "next/navigation";



type VerifyInput = {}; 
type VerifyOutput = { message: string;};


export default function VerifyButton({orgId}: {orgId:string}) {
    const  [state, setState] = useState({message: ""})
    const [pending, setPending] = useState(false)
    const func = httpsCallable<VerifyInput, VerifyOutput>(functions, 'verify');
    useActionToast(state, pending, {successMessage: "Verified User", loadingMessage: "Loading"})
    const router = useRouter()

    async function handleClick(){
        setPending(true)
        const res = await func({orgId: orgId})
        setState(res.data)
        setPending(false)
        router.refresh()
    }


  return (
    <PrimaryButton click={handleClick} text="Verify"/>
  )
}