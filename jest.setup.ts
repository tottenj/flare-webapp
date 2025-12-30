import '@testing-library/jest-dom';


global.fetch = jest.fn();
const mockFetchResponse = { ok: true, json: jest.fn(), text: jest.fn() };
(global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'fixed-uuid'),
  },
});

jest.mock('@/lib/auth/firebaseSignUpHelper', () => ({
  __esModule: true,
  default: jest.fn(async () => ({ idToken: 'token', uid: 'uid' })),
}));



jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));


jest.mock('./src/lib/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));