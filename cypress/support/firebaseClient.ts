// cypress/support/firebaseClient.ts
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';

const app = initializeApp({
  apiKey: Cypress.env('FIREBASE_API_KEY'),
  authDomain: Cypress.env('FIREBASE_AUTH_DOMAIN'),
  projectId: Cypress.env('FIREBASE_PROJECT_ID'),
});

export const functions = getFunctions(app); // match your functions region
export const auth = getAuth(app);
connectAuthEmulator(auth, `http://127.0.0.1:9099`, { disableWarnings: true });
connectFunctionsEmulator(functions, '127.0.0.1', 5001);
export { httpsCallable };
