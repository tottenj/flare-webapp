import FlareUser from '@/lib/classes/flareUser/FlareUser';
import signUpUser from './signUpUser';
import { expect } from '@jest/globals';

jest.mock('@/lib/classes/flareUser/FlareUser', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

describe('signUpUser', () => {
  it('calls flareUser class with the correct values', async () => {
    const mockFormData = new FormData();
    mockFormData.append('email', 'test@example.com');
    mockFormData.append('password', 'password123');

    const result = await signUpUser(mockFormData);
    expect(FlareUser.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      account_type: 'user',
    });
    expect(result).toEqual({
      status: 'success',
      message: 'Created User',
    });
  });

  it('returns error if flareUser throws', async () => {
    (FlareUser.create as jest.Mock).mockRejectedValueOnce(new Error('Error'));
    const mockFormData = new FormData();
    mockFormData.append('email', 'test@example.com');
    mockFormData.append('password', 'password123');
    const result = await signUpUser(mockFormData);

    expect(result).toEqual({
      status: 'error',
      message: 'server error',
    });
  });

  it('returns error if invalid form data', async () => {
     const mockFormData = new FormData();
     mockFormData.append('email', 'test@example.com');
     
    const result = await signUpUser(mockFormData)
    expect(result).toEqual({
      status: 'error',
      message: 'Invalid Form Data',
      errors: {
        password: ['Invalid input: expected string, received undefined'],
      },
    });

    expect(FlareUser.create).not.toHaveBeenCalled()

  })
});
