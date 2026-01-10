import { onRequest } from 'firebase-functions/v2/https';
import type { Request } from 'firebase-functions/v2/https';

// 🔑 Derive the Firebase Response type
type FirebaseResponse = Parameters<Parameters<typeof onRequest>[0]>[1];

export function mockRequest(overrides: Partial<Request> = {}): Request {
  return {
    headers: {},
    method: 'POST',
    body: {},
    is: jest.fn().mockReturnValue(true),
    rawBody: Buffer.from(''), // required by Firebase
    ...overrides,
  } as Request;
}

export function mockResponse(): FirebaseResponse {
  const res = {} as FirebaseResponse;

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);

  return res;
}
