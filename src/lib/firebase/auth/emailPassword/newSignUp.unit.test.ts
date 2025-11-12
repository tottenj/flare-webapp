import newSignUp from '@/lib/firebase/auth/emailPassword/newSignUp';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  deleteUser,
} from 'firebase/auth';
import { expect } from '@jest/globals';

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  signOut: jest.fn(),
  deleteUser: jest.fn(),
  getAuth: jest.fn(),
  connectAuthEmulator: jest.fn(),
}));
jest.mock('@/lib/firebase/auth/configs/clientApp', () => ({
  auth: {}, // mock auth object
}));

describe('newSignUp', () => {
  let mockUser: any;
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    mockUser = {
      uid: 'user123',
      getIdToken: jest.fn().mockResolvedValue('token123'),
    };
    global.fetch = jest.fn();
  });

  function makeFormData() {
    const fd = new FormData();
    fd.append('email', 'test@example.com');
    fd.append('password', 'abc123');
    return fd;
  }

  it('successfully signs up and returns uid', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: mockUser });
    (global.fetch as jest.Mock)
      // first call: POST /api/loginToken
      .mockResolvedValueOnce({ ok: true })
      // second call: POST /api/auth/signUp
      .mockResolvedValueOnce({ ok: true })
      // third call: DELETE /api/loginToken
      .mockResolvedValueOnce({ ok: true });

    const fd = makeFormData();
    const uid = await newSignUp(fd);

    expect(sessionStorage.getItem('manualLoginInProgress')).toBeNull();
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      'test@example.com',
      'abc123'
    );
    expect(mockUser.getIdToken).toHaveBeenCalledWith(true);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/loginToken',
      expect.objectContaining({ method: 'POST' })
    );
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/auth/signUp',
      expect.objectContaining({ method: 'POST' })
    );
    expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);
    expect(signOut).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/loginToken',
      expect.objectContaining({ method: 'DELETE' })
    );

    expect(uid).toBe('user123');
  });

  it('throws if missing email or password', async () => {
    const fd = new FormData();
    await expect(newSignUp(fd)).rejects.toThrow('Need Both Email And Password');
  });

  it('cleans up and deletes user on failure', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: mockUser });
    (global.fetch as jest.Mock)
      // POST /api/loginToken fails
      .mockResolvedValueOnce({ ok: false, status: 500 })
      // DELETE /api/loginToken (cleanup)
      .mockResolvedValueOnce({ ok: true });

    await expect(newSignUp(makeFormData())).rejects.toThrow('Failed to set session cookie');

    // Cleanup calls
    expect(deleteUser).toHaveBeenCalledWith(mockUser);
    expect(sessionStorage.getItem('manualLoginInProgress')).toBeNull();
  });

  it('cleans up on /api/auth/signUp error', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: mockUser });
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true }) // loginToken
      .mockResolvedValueOnce({ ok: false }) // signUp fails
      .mockResolvedValueOnce({ ok: true }); // cleanup delete

    await expect(newSignUp(makeFormData())).rejects.toThrow('Sign up error');
    expect(deleteUser).toHaveBeenCalledWith(mockUser);
    expect(sessionStorage.getItem('manualLoginInProgress')).toBeNull();
  });
});
