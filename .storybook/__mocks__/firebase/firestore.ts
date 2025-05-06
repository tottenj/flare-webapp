// .storybook/__mocks__/firebase/firestore.ts
export const getFirestore = () => ({
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ data: () => ({ uid: 'mock-user' }) }),
      set: () => Promise.resolve(),
      add: () => Promise.resolve(),
    }),
  }),
  doc: () => ({
    get: () => Promise.resolve({ data: () => ({ uid: 'mock-user' }) }),
    set: () => Promise.resolve(),
  }),
  setDoc: () => Promise.resolve(),
  getDoc: () => Promise.resolve({ data: () => ({ uid: 'mock-user' }) }),
  addDoc: () => Promise.resolve(),
});
