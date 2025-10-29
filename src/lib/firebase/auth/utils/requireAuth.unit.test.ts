import { cookies } from 'next/headers';
import requireAuth, { verifyResponse } from './requireAuth';
import { expect } from '@jest/globals';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('requireAuth', () => {
  const mockCookieValue = 'mock-session-cookie';
  const mockVerifyResponse: verifyResponse = {
    uid: 'user-123',
    claims: {
      admin: true,
      org: true,
      verified: true,
      emailVerified: true,
    },
  };

  it('throws Unauthorized if no session cookie', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    await expect(requireAuth()).rejects.toThrow('Unauthorized');
  });

  it('throws Unauthorized if verify function fails', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: mockCookieValue }),
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      text: async () => 'Error',
    });

    await expect(requireAuth()).rejects.toThrow('Unauthorized');
  });

  it('returns uid and claims if valid', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: mockCookieValue }),
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockVerifyResponse,
    });

    const result = await requireAuth();
    expect(result).toEqual({
      uid: 'user-123',
      claims: mockVerifyResponse.claims,
    });
  });

  it('throws Forbidden if required claim is missing', async () => {
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ value: mockCookieValue }),
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        uid: 'user-123',
        claims: { admin: false, org: true, verified: true, emailVerified: true },
      }),
    });

    await expect(requireAuth(['admin'])).rejects.toThrow('Forbidden: missing required claim admin');
  });
});
