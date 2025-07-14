
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

export const initializeFirestore = () => ({
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

export class GeoPoint {
  constructor(
    public latitude: number,
    public longitude: number
  ) {}
}

export const connectFirestoreEmulator = () => {};

export const doc = () => ({
  get: () => Promise.resolve({ data: () => ({ uid: 'mock-user' }) }),
  set: () => Promise.resolve(),
});

export const getDoc = () => Promise.resolve({ data: () => ({ uid: 'mock-user' }) });

export const setDoc = () => Promise.resolve();

export const addDoc = () => Promise.resolve();
export const getDocs = () => Promise.resolve();

export const collection = () => Promise.resolve();
export const where = () => Promise.resolve();
export const orderBy = () => Promise.resolve();
export const limit = () => Promise.resolve();
export const query = () => Promise.resolve();