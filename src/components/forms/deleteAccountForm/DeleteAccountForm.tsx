'use client';
import TextInput from '@/components/inputs/textInput/TextInput';
import {
  deleteUser,
  EmailAuthCredential,
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  signInWithPopup,
} from 'firebase/auth';
import { useRef, useState } from 'react';

export default function DeleteAccountForm() {
  const auth = getAuth();
  const user = auth.currentUser;
  const providers = user?.providerData.map((profile) => {
    return profile.providerId;
  });
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  async function deleteWithGoogle() {
    try {
      if (!user) {
        setError('Google Error') 
        return
    };
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const cred = GoogleAuthProvider.credentialFromResult(res)
     
      if(!cred) {
        setError("Google Error")
        return
    }
      const userCred = await reauthenticateWithCredential(user, cred);
      await deleteUser(userCred.user)
      return
    } catch (error) {
      setError('Google Error');
    }
  }

  async function reAuthAndDelete() {
    if (!email.current?.value || !password.current?.value || !user) {
      setError('None');
      return;
    }
    try {
      const cred = EmailAuthProvider.credential(email.current.value, password.current.value);
      const userCred = await reauthenticateWithCredential(user, cred);
      await deleteUser(userCred.user);
      return
    } catch (error) {
      setError('password');
      return;
    }
  }

  if (
    !providers ||
    providers.length == 0 ||
    !providers ||
    !providers.some((p) => p === 'google.com' || p === 'password')
  )
    return <p>Error</p>;

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-between">
      <h2>Are You Sure</h2>
      <p className="text-center text-lg">
        Deleting Your Account Is A Permanant Action and Cannot Be Undone. You will need to
        reauthenticate first, After providing your credentials your account will be deleted{' '}
        <b>FOREVER</b>
      </p>
      {error == 'None' && <p className="text-red">Please Authenticate To Delete Account</p>}
      {error == 'password' && <p className="text-red">Incorrect Email Or Password</p>}
      {error == 'Google Error' && (
        <p className="text-red">Error Deleting With Google Please Try Again Later</p>
      )}
      {providers.includes('password') && (
        <div>
          <TextInput label="Email" name="email" ref={email} />
          <TextInput label="Password" name="password" ref={password} />
          <button
            className="bg-red w-11/12 rounded-2xl p-2 font-black text-white hover:bg-red-600"
            onClick={() => reAuthAndDelete()}
          >
            Delete Account
          </button>
        </div>
      )}
      {providers.includes('google.com') && (
        <button
          className="bg-red w-11/12 rounded-2xl p-2 font-black text-white hover:bg-red-600"
          onClick={() => deleteWithGoogle()}
        >
          Delete Account With Google
        </button>
      )}
    </div>
  );
}
