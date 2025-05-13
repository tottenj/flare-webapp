import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth'; // No need for initializeAuth here unless you have specific needs
import { connectFirestoreEmulator, getFirestore, initializeFirestore } from 'firebase/firestore'; // Import connectFirestoreEmulator
import { connectStorageEmulator, getStorage } from 'firebase/storage'; // Import connectStorageEmulator
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'; // Import connectFunctionsEmulator (if you use functions client-side)
import firebaseConfig from '../../../../../firebaseconfig'; // Assuming this contains your production config

export const fireBaseApp = initializeApp(firebaseConfig);

// Get service instances BEFORE attempting to connect emulators
export const auth = getAuth(fireBaseApp);
export const db = initializeFirestore(fireBaseApp, {ignoreUndefinedProperties: true})
export const storage = getStorage(fireBaseApp);
// export const functions = getFunctions(fireBaseApp); // Uncomment if you use functions client-side

// Use a more robust check for client-side local development
if (
  typeof window !== 'undefined' &&
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
) {
  console.log(
    'Client-side code detected on local development host. Connecting to Firebase Emulators...'
  );

  // Connect Authentication to the emulator
  // Use the full URL including http://
  connectAuthEmulator(auth, `http://127.0.0.1:9099`, { disableWarnings: true });

  // Connect other emulators if you use them client-side
  // Make sure the ports match your emulator logs!
  // connectFirestoreEmulator(db, "127.0.0.1", 8080);
  // connectStorageEmulator(storage, "127.0.0.1", 9199);
  // if (functions) { // Only connect if functions is initialized
  //   connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  // }
} else {
  console.log('Running in production or server environment. Using production Firebase.');
}
