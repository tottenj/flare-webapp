import { verifySession } from '../../src';
import { auth } from '../../src/bootstrap/admin';
import { requireMethod } from '../../src/utils/guards/requireMethod';
import { mockRequest, mockResponse } from '../utils/mockHttp';
import { expect } from '@jest/globals';

jest.mock('../../src/utils/guards/requireMethod');
jest.mock('../../src/bootstrap/admin');

describe('verifySession', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (requireMethod as jest.Mock).mockReturnValue(true);
  });

  it('Successfully verifies session cookie', async () => {
    (auth.verifySessionCookie as jest.Mock).mockResolvedValueOnce({uid: "uid", email: "email", email_verified: true})
    const req = mockRequest({ body: { sessionCookie: 'session' } });
    const res = mockResponse();
    await verifySession(req, res);

    expect(auth.verifySessionCookie).toHaveBeenCalledWith('session', true)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({uid: 'uid', email: 'email', emailVerified: true}))
  })

  it('throws if not require method', async () => {
    (requireMethod as jest.Mock).mockReturnValue(false);
    const req = mockRequest({ method: 'GET' });
    const res = mockResponse();
    await verifySession(req, res);
    expect(requireMethod).toHaveBeenCalledWith(req, res, 'POST');
    expect(auth.verifySessionCookie).not.toHaveBeenCalled();
  });

  it('throws if no session cookie', async () => {
    const req = mockRequest();
    const res = mockResponse();
    await verifySession(req, res)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({error: "Missing session cookie"})
    expect(auth.verifySessionCookie).not.toHaveBeenCalled()
  })

  it("throws if error in verify session cookie", async () => {
    (auth.verifySessionCookie as jest.Mock).mockRejectedValueOnce(new Error("Error"))
    const req = mockRequest({body:{sessionCookie: "session"}});
    const res = mockResponse();
    await verifySession(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({error: "Invalid or expired session"})
  })
});
