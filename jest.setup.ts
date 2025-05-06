import '@testing-library/jest-dom';
require('dotenv').config({path: '.env.test'})

// jest.setup.js (or in your test file)
// Mock the `firebase/app` module
jest.mock('firebase/app', () => {
  const actualApp = jest.requireActual('firebase/app');

  return {
    ...actualApp,
    initializeApp: jest.fn(() => ({
      name: '[DEFAULT]',
      options: {},
      automaticDataCollectionEnabled: false,
      // Mock the container with getProvider to avoid undefined error
      container: {
        getProvider: jest.fn(() => ({
          getImmediate: jest.fn(),
        })),
      },
    })),
    getApps: jest.fn(() => []),
    getApp: jest.fn(),
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