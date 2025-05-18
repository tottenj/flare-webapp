// emailAndPasswordAction.test.ts

import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import the Firebase method
import emailAndPasswordAction from './emailAndPasswordAction';
import { expect } from '@jest/globals';
import { auth } from '../../configs/clientApp';


jest.mock('../../configs/getFirestoreFromServer', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({}),
}));

const mockAddUser = jest.fn();
jest.mock('@/lib/classes/flareUser/FlareUser', () => {
  return jest.fn().mockImplementation(() => ({
    addUser: mockAddUser,
  }));
});

describe('emailAndPasswordAction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user when valid email and password are provided', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    // Mock successful user creation
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { email: 'test@example.com' },
    });

    const result = await emailAndPasswordAction({}, formData);

    expect(result).toEqual({ message: 'success' });
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'test@example.com',
      'password123'
    );
  });

  it('should return an error when email is already in use', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    // Mock email already in use error
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({
      code: 'auth/email-already-in-use',
    });

    const result = await emailAndPasswordAction({}, formData);

    expect(result).toEqual({ message: 'Email is already in use' });
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'test@example.com',
      'password123'
    );
  });

  it('should return an error message when email or password is missing', async () => {
    const formData = new FormData();
    formData.append('email', ''); // No password

    const result = await emailAndPasswordAction({}, formData);

    expect(result).toEqual({ message: 'Error with email or password' });
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it('should return a generic error message for unknown errors', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    // Mock a general error
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({
      message: 'Unknown error',
    });

    const result = await emailAndPasswordAction({}, formData);

    expect(result).toEqual({ message: 'An error occurred. Please try again.' });
  });
});
