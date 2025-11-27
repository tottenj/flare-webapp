import { cleanup } from './cleanUpSignUp';
import { firebaseCreateUser } from './createFirebaseUser';
import createFlareUserFromSession from './createFlareUserFromSession';
import { setSessionCookie } from './createSessionCookie';

export default async function signUpUserClient({
  email,
  password,
  accountType,
}: {
  email: string;
  password: string;
  accountType: 'user' | 'org';
}) {
  let cred;

  try {
    sessionStorage.setItem('manualLoginInProgress', 'true');
    const result = await firebaseCreateUser(email, password);
    cred = result.cred;
    await setSessionCookie(result.idToken);
    await createFlareUserFromSession({ accountType, email });
    return cred.user.uid;
  } catch (err) {
    await cleanup(cred);
    throw err;
  } finally {
    await cleanup();
  }
}
