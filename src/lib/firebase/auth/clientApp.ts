import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../../../firebaseconfig";



export const fireBaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(fireBaseApp)
export const db = initializeFirestore(fireBaseApp, {ignoreUndefinedProperties: true})
export const storage = getStorage(fireBaseApp)
