// jest.setup.server.ts
import { TextEncoder, TextDecoder } from 'util';
import { fetch, Headers, Request, Response, FormData } from 'undici';

// ✅ Polyfill Web APIs for Next.js route testing in Node
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
(global as any).fetch = fetch;
(global as any).Headers = Headers as any;
(global as any).Request = Request as any;
(global as any).Response = Response as any;
(global as any).FormData = FormData as any;

// ✅ Simple in-memory sessionStorage mock (for client-state cleanup)
(global as any).sessionStorage = {
  store: {} as Record<string, string>,
  getItem(key: string) {
    return this.store[key] || null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  removeItem(key: string) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};
