import '@testing-library/jest-dom';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import prisma from '@/lib/prisma/prisma';
import { resetTestDb } from './__tests__/utils/restTestDb';

//const app = initializeApp({
  //projectId: process.env.FIREBASE_PROJECT_ID,
//});

//const auth = getAuth(app);
//const firestore = getFirestore(app);

// Connect to Firebase emulators once before all tests
beforeAll(async () => {
 // connectAuthEmulator(auth, 'http://127.0.0.1:9099');
  //connectFirestoreEmulator(firestore, '127.0.0.1', 8080);

  await prisma.$connect();
  // const res = await fetch('http://127.0.0.1:5001/flare-7091a/us-central1/seedAuthEmulator', {
  //   method: 'POST',
  // });
  // const data = await res.json();
  // console.log('Auth emulator seeded:', data);
  await resetTestDb(); // optionally seeds your schema
});

// Ensure each test file starts with a clean DB
beforeEach(async () => {
  await prisma.$transaction([prisma.flareUser.deleteMany(), prisma.user.deleteMany()]);
});

// Disconnect after all tests finish
afterAll(async () => {
  await prisma.$disconnect();
});
