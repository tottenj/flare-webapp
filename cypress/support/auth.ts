// cypress/support/auth.ts
import { Auth as FirebaseAuth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

declare global {
  namespace Cypress {
    interface Chainable {
      signUpWithEmailAndPassword(email: string, password: string): Chainable<void>;
      clearAuthEmulator(): Chainable<void>;
    }

    // Add this interface to extend Cypress namespace
    interface Cypress {
      firebaseAuth: FirebaseAuth;
    }
  }
}

export const setupFirebase = (): void => {
  const firebaseConfig = {
    apiKey: Cypress.env('AIzaSyDj5h2HzdQYuOzV_UVTHiwx1golUW93INU'),
    authDomain: Cypress.env('flare-7091a.firebaseapp.com'),
    projectId: Cypress.env('flare-7091a'),
    // Add other config values as needed
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  connectAuthEmulator(auth, 'http://localhost:9099');

  // Assign to the correct property
  Cypress.firebaseAuth = auth;
};
