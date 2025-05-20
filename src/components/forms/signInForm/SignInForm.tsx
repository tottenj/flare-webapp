"use client"
import GoogleSignInButton from "@/components/buttons/googleButton/SignInWithGoogleButton";
import PrimaryButton from "@/components/buttons/primaryButton/PrimaryButton";
import TextInput from "@/components/inputs/textInput/TextInput";
import { auth } from "@/lib/firebase/auth/configs/clientApp";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRef } from "react";

export default function SignInForm() {
    const email = useRef<HTMLInputElement>(null)
    const pass = useRef<HTMLInputElement>(null)
  

    async function handleFormSubmit(e:any){
      e.preventDefault()
        if(email.current?.value && pass.current?.value){
           const usr = await signInWithEmailAndPassword(auth, email.current.value, pass.current.value)
        }
    }
  
    return (
      <div className="@container flex w-5/6 flex-col items-center rounded-xl bg-white p-10 lg:w-1/2">
        <h1 className="mb-4">Sign In</h1>
        <form onSubmit={(e) => handleFormSubmit(e)} className="mb-8 w-5/6 @lg:w-2/3">
          <TextInput ref={email} label="Email" name="email" placeholder="example@gmail.com" />
          <TextInput ref={pass} label="Password" name="password" placeholder="**********" type="password" />
          <div className="flex justify-center">
            <PrimaryButton text="Submit" type="submit" size="full" />
          </div>
        </form>
        <GoogleSignInButton signIn={true} />
      </div>
    );
}