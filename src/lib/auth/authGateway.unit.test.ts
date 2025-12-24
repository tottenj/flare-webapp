import { AuthErrors } from '../errors/authError';
import AuthGateway from './authGateway';
import { expect } from '@jest/globals';

describe('AuthGateway.verifyIdToken', () => {
  it('Returns the json fields on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        uid: 'uid123',
        email: 'test@test.com',
        emailVerified: false,
      }),
    });

    await expect(AuthGateway.verifyIdToken('sampleToken')).resolves.toEqual({
      uid: 'uid123',
      email: 'test@test.com',
      emailVerified: false,
    });

    expect (global.fetch).toHaveBeenCalledTimes(1)
  });

  it('throws on 401 status', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 401,
    });
    await expect(AuthGateway.verifyIdToken('sample')).rejects.toEqual(AuthErrors.InvalidToken())
  });



  it('throws error on not ok', async () => {
    const textMock = jest.fn().mockResolvedValue('error text');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: textMock
    });
    await expect(AuthGateway.verifyIdToken('sample')).rejects.toEqual(AuthErrors.SignupFailed('error text'))
    expect(textMock).toHaveBeenCalled()
  })
});
