// cypress/support/types.d.ts
declare namespace Cypress {
  interface FirebaseEmulatorUser {
    localId: string;
    email: string;
    passwordHash: string;
    salt: string;
    createdAt: string;
  }

  interface FirebaseEmulatorResponse {
    users?: FirebaseEmulatorUser[];
  }

  interface FirebaseErrorResponse {
    error?: {
      message: string;
      code: number;
    };
  }
}
