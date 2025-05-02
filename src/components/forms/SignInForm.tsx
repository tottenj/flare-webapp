"use client"
import GoogleSignInButton from "../buttons/SignInWithGoogleButton";
import TextInput from "../inputs/TextInput";

export default function SignInForm() {
  return (
    <div className="bg-white w-4/6 rounded-xl p-10 flex flex-col items-center">
      <h1 className="mb-4">Sign Up</h1>
        <div className="w-2/3 mb-8">
          <TextInput label="Email" name="email" placeholder="example@gmail.com" />
          <TextInput label="Password" name="password" placeholder="**********" />
        </div>
        <GoogleSignInButton signIn={false}/>
    </div>
  );
}