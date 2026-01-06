import { createSessionHandler } from "../../src";
import { mockRequest, mockResponse } from "../utils/mockHttp";
import {expect} from "@jest/globals"

describe('createSessionHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 405 for non-POST requests', async () => {
    const req = mockRequest({ method: 'GET' });
    const res = mockResponse();

    await createSessionHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.send).toHaveBeenCalledWith('Method Not Allowed');
  });

})