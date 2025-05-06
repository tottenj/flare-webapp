// .storybook/__mocks__/firebase/firestore.ts
export const getDoc = jest.fn().mockResolvedValue({ data: () => ({ uid: 'mock-user' }) });
export const addDoc = jest.fn().mockResolvedValue({});
export const collection = jest.fn();
export const doc = jest.fn();
export const setDoc = jest.fn().mockResolvedValue({});
