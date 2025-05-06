// .storybook/__mocks__/firebase/auth.ts
export const GoogleAuthProvider = jest.fn(); // Mock constructor
export const signInWithPopup = jest.fn(); // Mock sign-in method
export const onAuthStateChanged = jest.fn((auth, callback) =>
  callback({ uid: 'mock-user', email: 'mock@example.com' })
);
export const onIdTokenChanged = jest.fn((auth, callback) =>
  callback({ uid: 'mock-user', email: 'mock@example.com' })
);
export const createUserWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const getAuth = jest.fn(() => ({
  currentUser: null,
  onAuthStateChanged,
}));
