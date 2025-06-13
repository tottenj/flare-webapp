import '@testing-library/jest-dom';
require('dotenv').config({ path: '.env.test' });

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
    sendEmailVerification: jest.fn(),
    connectAuthEmulator: jest.fn(),
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
    initializeFirestore: jest.fn(() => ({ firestore: 'mockFirestore' })),
    collection: jest.fn(),
    doc: jest.fn().mockReturnValue({
      withConverter: jest.fn().mockReturnThis(),
    }),
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

jest.mock('@googlemaps/js-api-loader', () => require('./__jestMocks__/@googlemaps/js-api-loader'));

jest.mock('@/lib/firebase/auth/configs/getFirestoreFromServer', () => {
  const mockFirestore = {}; // or a mock object with specific methods if needed
  const mockStorage = {}; // same as above
  const mockApp = {}; // mock firebaseServerApp
  const mockUser = { uid: 'mock-uid', email: 'test@example.com' };

  return {
    __esModule: true,
    getFirestoreFromServer: jest.fn().mockResolvedValue({
      firebaseServerApp: mockApp,
      currentUser: mockUser,
      fire: mockFirestore,
    }),
    getStorageFromServer: jest.fn().mockResolvedValue({
      storage: mockStorage,
      currentUser: mockUser,
    }),
    getServicesFromServer: jest.fn().mockResolvedValue({
      firestore: mockFirestore,
      storage: mockStorage,
      currentUser: mockUser,
    }),
  };
});


jest.mock('@/lib/utils/error/logErrors');
jest.mock('@/lib/firebase/firestore/firestoreOperations', () => ({
  addDocument: jest.fn(),
  getDocument: jest.fn(() => ({
    exists: jest.fn()
  })),
}));


jest.mock('@/lib/firebase/storage/storageOperations', () => ({
  addFile: jest.fn(),
}));

