import '@testing-library/jest-dom';
require('dotenv').config({path: '.env.test'})

// jest.setup.js (or in your test file)
// Mock the `firebase/app` module
jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(() => ({ app: 'mockApp' })),
    getApp: jest.fn(),
    getApps: jest.fn(() => []), // Mocking the list of apps
  };
});

// Mock the `firebase/auth` module
jest.mock('firebase/auth', () => {
  const originalModule = jest.requireActual('firebase/auth'); // Retain other methods if needed

  return {
    ...originalModule,
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    getAuth: jest.fn(() => ({
      currentUser: { uid: 'mock-uid', email: 'test@example.com' },
    })),
    onAuthStateChanged: jest.fn(),
    // Add more Firebase Auth methods you need to mock
  };
});

// Mock the `firebase/firestore` module if needed
jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');

  return {
    ...originalModule,
    getFirestore: jest.fn(() => ({ firestore: 'mockFirestore' })),
    collection: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
    getDoc: jest.fn(),
    addDoc: jest.fn(),
    // Add more Firestore methods if needed
  };
});

// Mock the `firebase/storage` module if needed
jest.mock('firebase/storage', () => {
  const originalModule = jest.requireActual('firebase/storage');

  return {
    ...originalModule,
    getStorage: jest.fn(() => ({ storage: 'mockStorage' })),
    // Add more Storage methods if needed
  };
});