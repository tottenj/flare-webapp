import 'server-only';
import { cookies, headers } from 'next/headers';
import { initializeServerApp, FirebaseServerAppSettings } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import firebaseConfig from '../../../../../firebaseconfig';


export async function getAuthenticatedAppForUser() {
  const headersObj = await headers();
  const token = (await cookies()).get('__session')?.value;
  const EMULATORS_ENABLED = process.env.NODE_ENV === 'development' || process.env.MODE === 'test'; // Or check for a custom env var

  let appSettings: FirebaseServerAppSettings = { authIdToken: token };
  appSettings.releaseOnDeref = headersObj;

  const firebaseServerApp = initializeServerApp(firebaseConfig, appSettings);
  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  if(EMULATORS_ENABLED){
    connectAuthEmulator(auth, `http://127.0.0.1:9099`, { disableWarnings: true });
  }

  return { firebaseServerApp, currentUser: auth.currentUser };
}


