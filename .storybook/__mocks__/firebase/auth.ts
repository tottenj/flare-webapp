// .storybook/__mocks__/firebase/auth.ts
export const GoogleAuthProvider = function () {}; // Mock constructor

export const connectAuthEmulator = (
  auth: any,
  url: string,
  options?: { disableWarnings?: boolean }
) => {
  console.log(`[Mock] Auth emulator connected to ${url}`);
  if (options?.disableWarnings !== true) {
    console.warn('[Mock] Auth emulator warnings are enabled');
  }
};



export const signInWithPopup = function () {
  return Promise.resolve({ user: { uid: 'mock-user', email: 'mock@example.com' } });
};
export const onAuthStateChanged = function (auth, callback) {
  callback({ uid: 'mock-user', email: 'mock@example.com' });
  return function () {}; // return a cleanup function
};


export const onIdTokenChanged = function (auth, callback) {
  callback({ uid: 'mock-user', email: 'mock@example.com' });
  return function () {}; // return a cleanup function
};
export const createUserWithEmailAndPassword = function () {
  return Promise.resolve();
};
export const signOut = function () {
  console.log('Mock sign out');
};
export const getAuth = function () {
  return { currentUser: null, onAuthStateChanged };
};


