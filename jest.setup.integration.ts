
import '@testing-library/jest-dom';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { resetTestDb } from './__tests__/utils/restTestDb';

const app = initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const auth = getAuth(app);
const firestore = getFirestore(app);

beforeAll(() => {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  resetTestDb();
});


