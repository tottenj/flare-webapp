import { POST } from '@/app/api/auth/signUp/route';
import { handleSignUp } from '@/lib/formActions/auth/signUpHandlers';
import { NextRequest, NextResponse } from 'next/server';
import { expect } from '@jest/globals';

jest.mock('@/lib/formActions/auth/signUpHandlers', () => ({
  handleSignUp: jest.fn(),
}));

describe('POST /api/auth/signUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles JSON request successfully', async () => {
    const body = { email: 'test@example.com', password: 'abc123', account_type: 'org' };

    const req = {
      headers: new Headers({ 'content-type': 'application/json' }),
      json: jest.fn().mockResolvedValue(body),
    } as unknown as NextRequest;

    (handleSignUp as jest.Mock).mockResolvedValue({ status: 'success', message: 'Created' });

    const res = await POST(req);
    const json = await res.json();

    expect(handleSignUp).toHaveBeenCalledWith('org', expect.any(FormData));
    expect(json).toEqual({ status: 'success', message: 'Created' });
    expect(res.status).toBe(200);
  });

  it('handles FormData request successfully', async () => {
    const formData = new FormData();
    formData.append('email', 'form@example.com');
    formData.append('account_type', 'user');

    const req = {
      headers: new Headers({ 'content-type': 'multipart/form-data' }),
      formData: jest.fn().mockResolvedValue(formData),
    } as unknown as NextRequest;

    (handleSignUp as jest.Mock).mockResolvedValue({ status: 'success', message: 'Form success' });

    const res = await POST(req);
    const json = await res.json();

    expect(handleSignUp).toHaveBeenCalledWith('user', expect.any(FormData));
    expect(json).toEqual({ status: 'success', message: 'Form success' });
    expect(res.status).toBe(200);
  });

  it('returns 400 if account_type missing', async () => {
    const formData = new FormData();
    formData.append('email', 'noType@example.com');

    const req = {
      headers: new Headers({ 'content-type': 'multipart/form-data' }),
      formData: jest.fn().mockResolvedValue(formData),
    } as unknown as NextRequest;

    const res = await POST(req);
    const json = await res.json();

    expect(json).toEqual({ error: 'Missing account type' });
    expect(res.status).toBe(400);
    expect(handleSignUp).not.toHaveBeenCalled();
  });

  it('returns 500 if handleSignUp throws', async () => {
    const body = { email: 'test@example.com', account_type: 'org' };

    const req = {
      headers: new Headers({ 'content-type': 'application/json' }),
      json: jest.fn().mockResolvedValue(body),
    } as unknown as NextRequest;

    (handleSignUp as jest.Mock).mockRejectedValue(new Error('Boom!'));

    const res = await POST(req);
    const json = await res.json();

    expect(json).toEqual({ error: 'Server error' });
    expect(res.status).toBe(500);
  });
});
