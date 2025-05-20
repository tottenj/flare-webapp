import 'server-only';
import { cookies, headers } from 'next/headers';
import { initializeServerApp, FirebaseServerAppSettings } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../../../../firebaseconfig';


export async function getAuthenticatedAppForUser() {
  const headersObj = await headers();
  const token = (await cookies()).get('__session')?.value;

  const cookieJar = await cookies(); // Get the cookie store
  const sessionCookie = cookieJar.get('__session'); // Get the specific cookie


  console.log('Server trying to get token:');
  console.log('Session Cookie:', sessionCookie); // Log the full cookie object
  console.log('Token Value:', token);

  let appSettings: FirebaseServerAppSettings = { authIdToken: token };
  appSettings.releaseOnDeref = headersObj;

  const firebaseServerApp = initializeServerApp(firebaseConfig, appSettings);
  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}


