import { requireMethod } from '../../../src/utils/guards/requireMethod';
import { mockRequest, mockResponse } from '../mockHttp';
import { expect } from '@jest/globals';

describe('Require Method', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('returns true if method correct', () => {
    const req = mockRequest({ method: 'POST' });
    const res = mockResponse();
    expect(requireMethod(req, res, 'POST')).toBe(true);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('returns false on wrong method', () => {
    const req = mockRequest({ method: 'POST' });
    const res = mockResponse();
    expect(requireMethod(req, res, 'GET')).toBe(false);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.send).toHaveBeenCalledWith('Method Not Allowed');
  });
});
