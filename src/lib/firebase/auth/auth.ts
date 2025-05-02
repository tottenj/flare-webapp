import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged as _onAuthStateChanged, onIdTokenChanged as _onIdTokenChanged, NextOrObserver, User } from "firebase/auth";
import { auth, db } from "./clientApp";
import getUserById from "../firestore/getUserById";
import { addDoc, doc, setDoc } from "firebase/firestore";
import Collections from "@/lib/enums/collections";

export function onAuthStateChanged(cb: NextOrObserver<User>) {
  return _onAuthStateChanged(auth, cb);
}


export function onIdTokenChanged(cb: NextOrObserver<User>) {
  return _onIdTokenChanged(auth, cb);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user
    const userData = await getUserById(user.uid)
    console.log(userData)

    if(userData){
      return userData
    }else{
      const docRef = doc(db, Collections.Users, user.uid);
      await setDoc(docRef, {id: user.uid})
    }

  } catch (error) {
    console.error("Error signing in with Google", error);
  }
}

export async function signOut() {
  try {
    return auth.signOut();
  } catch (error) {
    console.error("Error signing out with Google", error);
  }
}
