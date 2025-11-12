import '@testing-library/jest-dom';

global.fetch = jest.fn();
const mockFetchResponse = { ok: true, json: jest.fn(), text: jest.fn() };
(global.fetch as jest.Mock).mockResolvedValue(mockFetchResponse);

jest.mock('@/lib/prisma/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));
