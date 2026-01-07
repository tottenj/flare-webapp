import { deleteUserHandler } from '../../src';
import { auth } from '../../src/bootstrap/admin';
import { requireInternalApiKey } from '../../src/utils/guards/requireInternalApiKey';
import { requireMethod } from '../../src/utils/guards/requireMethod';
import { mockRequest, mockResponse } from '../utils/mockHttp';
import { expect } from '@jest/globals';

jest.mock('../../src/utils/guards/requireMethod');
jest.mock('../../src/bootstrap/admin');
jest.mock('../../src/utils/guards/requireInternalApiKey');

describe('delete User', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (requireMethod as jest.Mock).mockReturnValue(true);
    (requireInternalApiKey as jest.Mock).mockReturnValue(true);
  });

  it('successfully deletes user', async () => {
    (auth.deleteUser as jest.Mock).mockResolvedValueOnce(undefined)
    const req = mockRequest({body: {uid: "uid123"}});
    const res = mockResponse();
    await deleteUserHandler(req, res)

    expect(auth.deleteUser).toHaveBeenCalledWith('uid123')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ok:true})
  })

  it('throws if method not POST', async () => {
    (requireMethod as jest.Mock).mockReturnValueOnce(false);
    const req = mockRequest({ method: 'GET' });
    const res = mockResponse();
    await deleteUserHandler(req, res);
    expect(requireMethod).toHaveBeenCalledWith(req, res, 'POST');
    expect(auth.deleteUser).not.toHaveBeenCalled();
  });

  it('throws on failure of requireApiKey', async () => {
    (requireInternalApiKey as jest.Mock).mockReturnValue(false);
    const req = mockRequest({ method: 'POST' });
    const res = mockResponse();
    await deleteUserHandler(req, res);
    expect(requireInternalApiKey).toHaveBeenCalled();
    expect(auth.deleteUser).not.toHaveBeenCalled();
  });

   it('throws if no uid', async () => {
     const req = mockRequest();
     const res = mockResponse();
     await deleteUserHandler(req, res);
     expect(res.status).toHaveBeenCalledWith(400);
     expect(res.json).toHaveBeenCalledWith({ error: 'UID_REQUIRED' });
     expect(auth.deleteUser).not.toHaveBeenCalled()
   });

   it('throws if deleteUser throws', async () => {
      (auth.deleteUser as jest.Mock).mockRejectedValueOnce(new Error("Error"))
      const req = mockRequest({body: {uid: "uid123"}});
      const res = mockResponse();
      await deleteUserHandler(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({error: "DELETE_FAILED"})
   })
});
