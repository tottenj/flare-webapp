import { requireInternalApiKey } from '../../../src/utils/guards/requireInternalApiKey';
import { mockRequest, mockResponse } from '../mockHttp';
import {expect} from "@jest/globals"

const ORIGINAL_ENV = process.env;


describe('Require Internal Api Key', () => {
    beforeEach(() => {
        process.env = { ...ORIGINAL_ENV };
    })

    afterAll(() => {
        process.env = { ...ORIGINAL_ENV };
    })


  it('Returns true if keys match', () => {
    const req = mockRequest({ headers: { 'x-internal-api-key': 'apiKey' } });
    const res = mockResponse();
    process.env.INTERNAL_API_KEY = "apiKey"
    expect(requireInternalApiKey(req, res)).toBe(true)
    expect(res.json).not.toHaveBeenCalled();
  });

  it("Returns false if keys don't match", () => {
    const req = mockRequest({ headers: { 'x-internal-api-key': 'apiKey' } });
    const res = mockResponse();
    process.env.INTERNAL_API_KEY = 'apikey';
    expect(requireInternalApiKey(req, res)).toBe(false)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({code: "UNAUTHORIZED"})

  })
});
