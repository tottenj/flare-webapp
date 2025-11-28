import {expect} from '@jest/globals';

import signUpUserClient from './signUpUserClient';

import { cleanup } from './cleanUpSignUp';
import { firebaseCreateUser } from './createFirebaseUser';
import createFlareUserFromSession from './createFlareUserFromSession';
import { setSessionCookie } from './createSessionCookie';

// --- Mock all dependencies ---
jest.mock('./cleanUpSignUp', () => ({
  cleanup: jest.fn()
}));

jest.mock('./createFirebaseUser', () => ({
  firebaseCreateUser: jest.fn()
}));

jest.mock('./createFlareUserFromSession', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('./createSessionCookie', () => ({
  setSessionCookie: jest.fn()
}));

// Provide mock sessionStorage for Jest
beforeEach(() => {
  Storage.prototype.setItem = jest.fn();
  jest.clearAllMocks();
});

describe('signUpUserClient', () => {
  const mockCred = {
    user: { uid: '12345' }
  };

  const mockResult = {
    cred: mockCred,
    idToken: 'FAKE_TOKEN'
  };

  // Default success behavior
  beforeEach(() => {
    (firebaseCreateUser as jest.Mock).mockResolvedValue(mockResult);
    (setSessionCookie as jest.Mock).mockResolvedValue(undefined);
    (createFlareUserFromSession as jest.Mock).mockResolvedValue(undefined);
    (cleanup as jest.Mock).mockResolvedValue(undefined);
  });


  it('creates user, sets cookie, creates flare user, returns uid', async () => {
    const uid = await signUpUserClient({
      email: 'test@example.com',
      password: 'pass123!',
      accountType: 'user'
    });

    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      'manualLoginInProgress',
      'true'
    );

    expect(firebaseCreateUser).toHaveBeenCalledWith(
      'test@example.com',
      'pass123!'
    );

    expect(setSessionCookie).toHaveBeenCalledWith('FAKE_TOKEN');

    expect(createFlareUserFromSession).toHaveBeenCalledWith({
      accountType: 'user',
      email: 'test@example.com'
    });

    // cleanup() is ALWAYS called in finally
    expect(cleanup).toHaveBeenCalledTimes(1);

    expect(uid).toBe('12345');
  });


  it('calls cleanup twice on error (with cred + bare)', async () => {
    (createFlareUserFromSession as jest.Mock).mockRejectedValue(
      new Error('flare fail')
    );

    await expect(
      signUpUserClient({
        email: 'x@g.com',
        password: 'pw',
        accountType: 'user'
      })
    ).rejects.toThrow('flare fail');

    // First cleanup should get cred
    expect(cleanup).toHaveBeenNthCalledWith(1, mockCred);

    // Second cleanup from finally()
    expect(cleanup).toHaveBeenNthCalledWith(2);
  });


  it('handles firebaseCreateUser failure (cleanup called twice, first with undefined)', async () => {
    (firebaseCreateUser as jest.Mock).mockRejectedValue(
      new Error('firebase fail')
    );

    await expect(
      signUpUserClient({
        email: 'x@g.com',
        password: 'pw',
        accountType: 'user'
      })
    ).rejects.toThrow('firebase fail');

    expect(cleanup).toHaveBeenNthCalledWith(1, undefined);
    expect(cleanup).toHaveBeenNthCalledWith(2);
  });
});
