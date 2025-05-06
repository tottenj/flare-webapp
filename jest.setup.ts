import '@testing-library/jest-dom';
require('dotenv').config({path: '.env.test'})


jest.mock('firebase/auth', () => ({
  getAuth: () => ({
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  }),
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: () => [],
}));