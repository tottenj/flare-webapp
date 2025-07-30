// .storybook/__mocks__/serverApp/getFirestoreFromServer.ts
console.log('✅ MOCK getFirestoreFromServer HIT');

export const getFirestoreFromServer = async () => {
  return { firebaseServerApp: {}, currentUser: null, fire: {} };
};

export const getServicesFromServer = async () => {
  return { firestore: {}, storage: {}, currentUser: null };
};

export const getFirestoreFromStatic = async () => ({});
export const getStorageFromServer = async () => ({ storage: {}, currentUser: null });
