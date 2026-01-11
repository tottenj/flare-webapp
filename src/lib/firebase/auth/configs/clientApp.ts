import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, signInWithEmailAndPassword} from 'firebase/auth'; // No need for initializeAuth here unless you have specific needs
import { connectFirestoreEmulator, initializeFirestore } from 'firebase/firestore'; // Import connectFirestoreEmulator
import { connectStorageEmulator, getStorage } from 'firebase/storage'; // Import connectStorageEmulator
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'; // Import connectFunctionsEmulator (if you use functions client-side)
import firebaseConfig from '../../../../../firebaseconfig'; // Assuming this contains your production config

export const fireBaseApp = initializeApp(firebaseConfig);

// Get service instances BEFORE attempting to connect emulators
export const auth = getAuth(fireBaseApp);
export const db = initializeFirestore(fireBaseApp, { ignoreUndefinedProperties: true });
export const storage = getStorage(fireBaseApp);
export const functions = getFunctions(fireBaseApp)



if (process.env.NEXT_PUBLIC_MODE === 'test') {
  connectAuthEmulator(auth, `http://127.0.0.1:9099`, { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  connectStorageEmulator(storage, '127.0.0.1', 9199);

  if (typeof window !== 'undefined') {
    const win = window as any;
    win.auth = auth;
    win.signInWithEmailAndPassword = signInWithEmailAndPassword;
  }


} else {
  console.log("Client Emulators Enabled: false")
}
