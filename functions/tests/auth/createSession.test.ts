import { createSessionHandler } from '../../src';
import { auth } from '../../src/bootstrap/admin';
import { requireMethod } from '../../src/utils/guards/requireMethod';
import { mockRequest, mockResponse } from '../utils/mockHttp';
import { expect } from '@jest/globals';

jest.mock('../../src/bootstrap/admin');
jest.mock('../../src/utils/guards/requireMethod');

describe('createSessionHandler', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('successfullly returns session cookie', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ email_verified: true });
    (auth.createSessionCookie as jest.Mock).mockResolvedValueOnce('session');
    (requireMethod as jest.Mock).mockReturnValueOnce(true);
    const req = mockRequest({ body: { idToken: 'idToken' } });
    const res = mockResponse();

    await createSessionHandler(req, res);

    expect(auth.verifyIdToken).toHaveBeenCalledWith('idToken');
    expect(auth.createSessionCookie).toHaveBeenCalledWith(
      'idToken',
      expect.objectContaining({ expiresIn: expect.any(Number) })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ sessionCookie: 'session' });
  });

  it('throws if method not POST', async () => {
      (requireMethod as jest.Mock).mockReturnValueOnce(false);
      const req = mockRequest({ method: 'GET' });
      const res = mockResponse();
      await createSessionHandler(req, res);
      expect(requireMethod).toHaveBeenCalled();
      expect(auth.createSessionCookie).not.toHaveBeenCalled();
    });

  it('returns 400 if no id token', async () => {
    (requireMethod as jest.Mock).mockReturnValueOnce(true);
    const req = mockRequest({ body: {} });
    const res = mockResponse();

    await createSessionHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'ID_TOKEN_REQUIRED' });
  });

  it('returns 401 on thrown error', async () => {
    (requireMethod as jest.Mock).mockReturnValueOnce(true);
    (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(new Error('Invalid token'));
    const req = mockRequest({ body: { idToken: 'idToken' } });
    const res = mockResponse();

    await createSessionHandler(req, res);
    expect(auth.verifyIdToken).toHaveBeenCalledWith('idToken');
    expect(auth.createSessionCookie).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid Token' });
  });

  it('returns 403 on unverified email', async () => {
    (requireMethod as jest.Mock).mockReturnValueOnce(true);
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({ email_verified: false });
    const req = mockRequest({ body: { idToken: 'idToken' } });
    const res = mockResponse();

    await createSessionHandler(req, res);
    expect(auth.verifyIdToken).toHaveBeenCalledWith('idToken');
    expect(auth.createSessionCookie).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email Unverified' });
  });
});
