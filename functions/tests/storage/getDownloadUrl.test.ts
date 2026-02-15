import { expect } from '@jest/globals';
import { mockRequest, mockResponse } from '../utils/mockHttp';
import { getDownloadUrlHandler } from '../../src';
import { getDownloadURL } from 'firebase-admin/storage';
import { requireMethod } from '../../src/utils/guards/requireMethod';
import { requireInternalApiKey } from '../../src/utils/guards/requireInternalApiKey';
import { getInternalApiKey } from '../../src/utils/guards/getInternalApiKey';

var bucketMock: jest.Mock;
var fileMock: jest.Mock;

jest.mock('../../src/bootstrap/admin', () => {
  fileMock = jest.fn();
  bucketMock = jest.fn(() => ({
    file: fileMock,
  }));

  return {
    storage: {
      bucket: bucketMock,
    },
  };
});

jest.mock('firebase-admin/storage', () => ({
  getDownloadURL: jest.fn(),
}));


jest.mock('../../src/utils/guards/requireInternalApiKey');
jest.mock('../../src/utils/guards/requireMethod');

describe('getDownloadUrlHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (requireMethod as jest.Mock).mockReturnValue(true);
    (requireInternalApiKey as jest.Mock).mockReturnValue(true);
  });

  it("successfully returns downloadUrl", async () => {
    (getDownloadURL as jest.Mock).mockResolvedValueOnce("path");
    const req = mockRequest({ body: { storagePath: 'path' } });
    const res = mockResponse();
    await getDownloadUrlHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({downloadUrl: "path"})
  })

  it('returns on method other than post', async () => {
    (requireMethod as jest.Mock).mockReturnValueOnce(false);
    const req = mockRequest({ method: 'GET' });
    const res = mockResponse();
    await getDownloadUrlHandler(req, res);
    expect(requireMethod).toHaveBeenCalledWith(req, res, 'POST');
    expect(getDownloadURL).not.toHaveBeenCalled();
  });

  it('returns on no api key', async () => {
    (requireInternalApiKey as jest.Mock).mockReturnValue(false);
    const req = mockRequest();
    const res = mockResponse();
    await getDownloadUrlHandler(req, res);
    expect(requireInternalApiKey).toHaveBeenCalled();
    expect(getDownloadURL).not.toHaveBeenCalled();
  });

  it('returns on no storage path', async () => {
    const req = mockRequest();
    const res = mockResponse();
    await getDownloadUrlHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ code: 'STORAGE_MISSING_PATH' });
    expect(getDownloadURL).not.toHaveBeenCalled();
  });

  it('returns 400 if getDownloadURL throws', async () => {
    (getDownloadURL as jest.Mock).mockRejectedValueOnce(new Error('Error'));
    const req = mockRequest({ body: { storagePath: 'path' } });
    const res = mockResponse();
    await getDownloadUrlHandler(req, res);
    expect(bucketMock).toHaveBeenCalledTimes(1);
    expect(fileMock).toHaveBeenCalledWith('path');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ code: 'STORAGE_INVALID_PATH' });
  });
});
