// .storybook/__mocks__/authHelpers.ts

export const signInWithGoogle = async () => {
  console.log('Mock sign in');
  return { uid: 'mock-user', email: 'mock@example.com' };
};

export const signOut = async () => {
  console.log('Mock sign out');
};

export const onAuthStateChanged = (cb) => {
  console.log('Mock onAuthStateChanged');
  cb({ uid: 'mock-user', email: 'mock@example.com' });
  return () => {};
};

export const onIdTokenChanged = (cb) => {
  console.log('Mock onIdTokenChanged');
  cb({ uid: 'mock-user', email: 'mock@example.com' });
  return () => {};
};
