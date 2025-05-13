// signInWithGoogle.test.ts
import { signInWithGoogle } from './signInWithGoogle';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { auth } from '../configs/clientApp';
import { expect } from '@jest/globals';

jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock('../configs/clientApp', () => ({
  auth: {},
}));

jest.mock('@/lib/classes/flareUser/FlareUser', () => {
  return {
    __esModule: true,
    default: class MockFlareUser {
      static getUserById = jest.fn();
      addUser = jest.fn();
      constructor(user: any) {
        Object.assign(this, user);
      }
    },
  };
});

describe('signInWithGoogle', () => {
  const mockUser = { uid: '123', displayName: 'Test User' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns existing user data if found', async () => {
    (signInWithPopup as jest.Mock).mockResolvedValue({ user: mockUser });
    (FlareUser.getUserById as jest.Mock).mockResolvedValue({ uid: '123', role: 'org' });

    const result = await signInWithGoogle();

    expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
    expect(FlareUser.getUserById).toHaveBeenCalledWith('123');
    expect(result).toEqual({ uid: '123', role: 'org' });
  });

  it('creates and returns new FlareUser if not found', async () => {
    (signInWithPopup as jest.Mock).mockResolvedValue({ user: mockUser });
    (FlareUser.getUserById as jest.Mock).mockResolvedValue(null);

    const result = await signInWithGoogle();

    expect(signInWithPopup).toHaveBeenCalled();
    expect(FlareUser.getUserById).toHaveBeenCalledWith('123');

    // ✅ Type narrowing
    expect(result).toBeDefined();
    if (result) {
      expect(result).toMatchObject(mockUser);
      expect(result.addUser).toBeDefined();
    }
  });

  it('logs an error if signInWithPopup fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (signInWithPopup as jest.Mock).mockRejectedValue(new Error('Popup failed'));

    const result = await signInWithGoogle();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing in with Google', expect.any(Error));
    expect(result).toBeUndefined();

    consoleErrorSpy.mockRestore();
  });
});
