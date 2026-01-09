import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

process.env.FIREBASE_FUNCTION_URL = 'https://example.com';
process.env.INTERNAL_API_KEY = 'test-api-key';



global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

global.fetch = jest.fn();

global.Request = class {} as any;
global.Response = class {} as any;
global.Headers = class {} as any;

const mockFetchResponse = {
  ok: true,
  json: jest.fn(),
  text: jest.fn(),
};

(global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'fixed-uuid'),
  },
});

// ---- mocks ----

jest.mock('@/lib/firebase/auth/configs/clientApp', () => ({
  auth: {},
  db: {},
  storage: {},
  functions: {},
  fireBaseApp: {},
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
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

jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('next/cache', () => ({
  updateTag: jest.fn(),
}));

