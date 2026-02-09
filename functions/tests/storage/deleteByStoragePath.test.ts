import { deleteByStoragePathHandler } from '../../src';
import { getInternalApiKey } from '../../src/utils/guards/getInternalApiKey';
import { requireInternalApiKey } from '../../src/utils/guards/requireInternalApiKey';
import { requireMethod } from '../../src/utils/guards/requireMethod';
import { mockRequest, mockResponse } from '../utils/mockHttp';
import { expect } from '@jest/globals';

var bucketMock: jest.Mock;
var fileMock: jest.Mock;
var deleteMock: jest.Mock;

jest.mock('../../src/bootstrap/admin', () => {
  deleteMock = jest.fn(() => Promise.resolve());

  fileMock = jest.fn(() => ({
    delete: deleteMock,
  }));

  bucketMock = jest.fn(() => ({
    file: fileMock,
  }));

  return {
    __esModule: true,
    storage: {
      bucket: bucketMock,
    },
  };
});



jest.mock('../../src/utils/guards/getInternalApiKey');
jest.mock('../../src/utils/guards/requireInternalApiKey');
jest.mock('../../src/utils/guards/requireMethod');

describe('deleteByStoragePath', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getInternalApiKey as jest.Mock).mockReturnValue("apiKey")
    (requireMethod as jest.Mock).mockReturnValue(true);
    (requireInternalApiKey as jest.Mock).mockReturnValue(true);
  });

  it('succesfully deletes file at path', async () => {

    const req = mockRequest({
      body: { storagePath: 'users/path' },
      is: jest.fn().mockReturnValue(true), // ✅ correct location
    });
    const res = mockResponse();
    await deleteByStoragePathHandler(req, res);
    expect(fileMock).toHaveBeenCalledWith("users/path")
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ok: true})
  });

  it('returns if method not post', async () => {
    (requireMethod as jest.Mock).mockReturnValueOnce(false);
    const req = mockRequest({ method: 'GET' });
    const res = mockResponse();
    await deleteByStoragePathHandler(req, res);
    expect(requireMethod).toHaveBeenCalledWith(req, res, 'POST');
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('returns if no internal api key', async () => {
    (requireInternalApiKey as jest.Mock).mockReturnValueOnce(false);
    const req = mockRequest();
    const res = mockResponse();
    await deleteByStoragePathHandler(req, res);
    expect(requireInternalApiKey).toHaveBeenCalled();
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('returns 415 if content-type is not application/json', async () => {
    const req = mockRequest({
      body: { storagePath: 'users/uid/profile-pic.jpg' },
      is: jest.fn().mockReturnValue(false), // 👈 key line
    });
    const res = mockResponse();
    await deleteByStoragePathHandler(req, res);
    expect(req.is).toHaveBeenCalledWith('application/json');
    expect(res.status).toHaveBeenCalledWith(415);
    expect(res.json).toHaveBeenCalledWith({
      code: 'UNSUPPORTED_MEDIA_TYPE',
    });
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('returns if no storage path', async () => {
    const req = mockRequest({
      is: jest.fn().mockReturnValueOnce(true),
    });
    const res = mockResponse();
    await deleteByStoragePathHandler(req, res);
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('returns if path not in allowed prefixes', async () => {
    const req = mockRequest({ body: { storagePath: 'path' } });
    const res = mockResponse();
    await deleteByStoragePathHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ code: 'STORAGE_PATH_FORBIDDEN' });
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('returns if failure in deletion', async () => {
    (deleteMock as jest.Mock).mockRejectedValueOnce(new Error('Error'));
    const req = mockRequest({ body: { storagePath: 'users/path' } });
    const res = mockResponse();
    await deleteByStoragePathHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ code: 'STORAGE_DELETE_FAILED' });
  });
});
