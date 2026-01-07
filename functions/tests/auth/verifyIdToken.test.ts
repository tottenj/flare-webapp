import { verifyIdToken } from '../../src';
import { auth } from '../../src/bootstrap/admin';
import { requireMethod } from '../../src/utils/guards/requireMethod';
import { mockRequest, mockResponse } from '../utils/mockHttp';
import {expect} from "@jest/globals"

jest.mock('../../src/utils/guards/requireMethod');
jest.mock('../../src/bootstrap/admin');

describe('verifyIdToken', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (requireMethod as jest.Mock).mockReturnValue(true);
  });

  it("Successfully verifies token", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({uid: 'uid', email: "email", email_verified: true})
    const req = mockRequest({ body: { idToken: 'idToken' } });
    const res = mockResponse();
    await verifyIdToken(req, res);
    expect(auth.verifyIdToken).toHaveBeenCalledWith('idToken')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({uid: 'uid', email: 'email', emailVerified: true}))
  })

  it("throws if not require method", async () => {
    (requireMethod as jest.Mock).mockReturnValue(false);
    const req = mockRequest({method: "GET"})
    const res = mockResponse()
    await verifyIdToken(req, res)
    expect(requireMethod).toHaveBeenCalledWith(req, res, 'POST');
    expect(auth.verifyIdToken).not.toHaveBeenCalled()
  })


  it('throws if no id token', async () => {
    const req = mockRequest();
    const res = mockResponse();
    await verifyIdToken(req, res);
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({error: "ID_TOKEN_REQUIRED"})
    expect(auth.verifyIdToken).not.toHaveBeenCalled()
  })

  it('throws on failure of verify id token', async () => {
    (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(new Error("Error"))
    const req = mockRequest({body:{idToken: "idToken"}});
    const res = mockResponse();
    await verifyIdToken(req, res);
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({error: "INVALID_TOKEN"})

  })

});
