import '@testing-library/jest-dom';
require('dotenv').config({path: '.env.test'})

// jest.setup.js (or in your test file)

process.env.JEST_ENV = 'true';  // Set this flag for Jest

jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getFirestore: jest.fn(() => ({
    collection: jest.fn().mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: () => ({ uid: 'mock-user' }) }),
        set: jest.fn().mockResolvedValue({}),
      }),
    }),
    doc: jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: () => ({ uid: 'mock-user' }) }),
      set: jest.fn().mockResolvedValue({}),
    }),
    setDoc: jest.fn().mockResolvedValue({}),
    getDoc: jest.fn().mockResolvedValue({ data: () => ({ uid: 'mock-user' }) }),
    addDoc: jest.fn().mockResolvedValue({}),
  })),
}));
