import { AuthErrors } from '../errors/authError';
import AuthGateway from './authGateway';
import { expect } from '@jest/globals';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe('AuthGateway.verifyIdToken', () => {
  it('Returns the json fields on success', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        uid: 'uid12',
        email: 'test@test.com',
        emailVerified: false,
      }),
    });

    await expect(AuthGateway.verifyIdToken('sampleToken')).resolves.toEqual({
      uid: 'uid123',
      email: 'test@test.com',
      emailVerified: false,
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('throws on 401 status', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 401,
    });
    await expect(AuthGateway.verifyIdToken('sample')).rejects.toEqual(AuthErrors.InvalidToken());
  });

  it('throws error on not ok', async () => {
    const textMock = jest.fn().mockResolvedValue('error text');
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: textMock,
    });
    await expect(AuthGateway.verifyIdToken('sample')).rejects.toEqual(
      AuthErrors.SignupFailed('error text')
    );
    expect(textMock).toHaveBeenCalled();
  });
});

describe('AuthGateway.createSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Return session cookie on success', async () => {
    const sessionCookie = 'mockSessionCooke';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ sessionCookie }),
    });
    await expect(AuthGateway.createSession('fakeToken')).resolves.toBe(sessionCookie);
  });

  it('returns invalid token error on 401', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });
    await expect(AuthGateway.createSession('token')).rejects.toMatchObject({
      code: 'AUTH_INVALID_TOKEN',
    });
  });

  it('returns email unverified error on 403', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
    });
    await expect(AuthGateway.createSession('token')).rejects.toMatchObject({
      code: 'UNVERIFIED_EMAIL',
    });
  });

  it('throws error if res is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });
    await expect(AuthGateway.createSession('token')).rejects.toMatchObject({
      code: 'AUTH_SIGNIN_FAILED',
    });
  });

  it('throws error if no session cookie recieved', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({}),
    });
    await expect(AuthGateway.createSession('token')).rejects.toMatchObject({
      code: 'AUTH_SIGNIN_FAILED',
    });
  });
});

describe('AuthGateway.verifySession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const sessionCookie = 'mockSessionCooke';

  it('successfully returns session info', async () => {
    const returnVal = {
      uid: 'uid123',
      email: 'example@gmail.com',
      emailVerified: false,
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(returnVal),
    });
    await expect(AuthGateway.verifySession(sessionCookie)).resolves.toBe(returnVal);
  });

  it('throws correct error on 401', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });
    await expect(AuthGateway.verifySession(sessionCookie)).rejects.toThrow(
      AuthErrors.InvalidSession()
    );
  });

  it('throws correct error on 403', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });
    await expect(AuthGateway.verifySession(sessionCookie)).rejects.toThrow(
      AuthErrors.SigninFailed()
    );
  });
});
