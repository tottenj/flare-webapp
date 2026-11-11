import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth/configs/clientApp';

type SignOutRouter = {
  push: (href: string) => void;
  refresh: () => void;
};

export async function signOutUser(router: SignOutRouter) {
  try {
    await fetch('/api/auth/signout', { method: 'POST' });
  } catch (error) {
    console.error('Failed to clear server session', error);
  }

  try {
    await signOut(auth);
    router.push('/signin');
    router.refresh();
  } catch (error) {
    console.error('Failed to sign out', error);
  }
}
