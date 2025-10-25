// __mocks__/firebase/auth.ts
import * as originalModule from 'firebase/auth';
// Re-export everything you don’t override
export * from 'firebase/auth';
// Override the methods you want to mock
export const createUserWithEmailAndPassword = jest.fn();
export const signInWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const getAuth = jest.fn(() => ({
  currentUser: { uid: 'mock-uid', email: 'test@example.com' },
}));
export const sendEmailVerification = jest.fn();
export const connectAuthEmulator = jest.fn();
export const onAuthStateChanged = jest.fn();

//to use just say jest.mock(firebase/auth) in test