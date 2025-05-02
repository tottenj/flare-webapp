"use client"

import { signInWithGoogle } from "@/lib/firebase/auth/auth";


interface googleSignInButtonProps{
    signIn: boolean
}

export default function GoogleSignInButton({signIn}: googleSignInButtonProps) {



  return (
    <button onClick={signInWithGoogle} className="flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm transition duration-300">
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className="h-5 w-5 mr-3" />
      Sign {signIn ? "In" : "Up"} With Google
    </button>
  );
}
