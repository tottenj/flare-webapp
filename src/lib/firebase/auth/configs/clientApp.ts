import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../../../../firebaseconfig';

export const fireBaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(fireBaseApp);
export const db = getFirestore(fireBaseApp);
export const storage = getStorage(fireBaseApp);

if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  console.log(`Connecting Auth emulator to ${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
  connectAuthEmulator(auth, `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
  // Note: connectAuthEmulator expects the URL, including 'http://'
}