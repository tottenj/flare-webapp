import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';

const app = initializeApp({
  apiKey: '...',
  authDomain: 'flare-7091a.firebaseapp.com',
  projectId: 'flare-7091a',
});

const functions = getFunctions(app, 'us-central1'); // <- region
connectFunctionsEmulator(functions, 'localhost', 5001);

const seedDbCallable = httpsCallable(functions, 'seedDb');

async function testSeed() {
  const result = await seedDbCallable({});
  console.log('Seed result:', result.data); // should be { result: 'LJF' }
}

testSeed();
