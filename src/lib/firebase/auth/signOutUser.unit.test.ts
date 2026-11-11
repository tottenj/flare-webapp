import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import { signOutUser } from './signOutUser';

jest.mock('firebase/auth', () => ({ signOut: jest.fn() }));

describe('signOutUser', () => {
  const router = { push: jest.fn(), refresh: jest.fn() };

  it('clears the session, signs out of Firebase, and refreshes the sign-in page', async () => {
    await signOutUser(router);

    expect(fetch).toHaveBeenCalledWith('/api/auth/signout', { method: 'POST' });
    expect(signOut).toHaveBeenCalledWith(auth);
    expect(router.push).toHaveBeenCalledWith('/signin');
    expect(router.refresh).toHaveBeenCalled();
    expect(jest.mocked(fetch).mock.invocationCallOrder[0]).toBeLessThan(
      jest.mocked(signOut).mock.invocationCallOrder[0]
    );
  });

  it('still signs out of Firebase if clearing the session fails', async () => {
    const error = new Error('network error');
    const logError = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mocked(fetch).mockRejectedValueOnce(error);

    await signOutUser(router);

    expect(logError).toHaveBeenCalledWith('Failed to clear server session', error);
    expect(signOut).toHaveBeenCalledWith(auth);
    expect(router.push).toHaveBeenCalledWith('/signin');
    logError.mockRestore();
  });

  it('does not redirect if Firebase sign-out fails', async () => {
    const error = new Error('sign-out error');
    const logError = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mocked(signOut).mockRejectedValueOnce(error);

    await signOutUser(router);

    expect(logError).toHaveBeenCalledWith('Failed to sign out', error);
    expect(router.push).not.toHaveBeenCalled();
    expect(router.refresh).not.toHaveBeenCalled();
    logError.mockRestore();
  });
});
