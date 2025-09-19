// cypress/support/firebaseClient.ts
import { initializeApp } from 'firebase/app';
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';

const app = initializeApp({
  apiKey: Cypress.env('FIREBASE_API_KEY'),
  authDomain: Cypress.env('FIREBASE_AUTH_DOMAIN'),
  projectId: Cypress.env('FIREBASE_PROJECT_ID'),
});

export const functions = getFunctions(app); // match your functions region
connectFunctionsEmulator(functions, '127.0.0.1', 5001);
export { httpsCallable };
