// cypress/support/types.d.ts
declare namespace Cypress {
  interface Chainable {
    createUser(
      email: string,
      password: string,
      name: string,
      emailVerified?: boolean,
      org?: boolean
    ): Chainable<{
      uid: string;
      email: string;
      password: string;
      name: string;
      [key: string]: any;
    }>;
    loginUser(email: string, password: string): Chainable<Response<any>>;
    clearFirestore(): Chainable<Cypress.Response<any>>;
    clearAuth(): Chainable<Cypress.Response<any>>;
    clearAllEmulators(): Chainable<Cypress.Response<any>>;
    logoutUser(): Chainable<Cypress.Response<any>>;
    seedDb(maxRetries: number = 1): Chainable<Cypress.Response<any>>;
    loginTestUser(): Chainable<void>;
    loginTestOrg(): Chainable<void>;
    loginVerifiedOrg(): Chainable<void>;
    usePlacesInput(
      selector: string,
      loc: string = verifiedOrg.location.name,
      contains: string = 'Toronto Pearson International Airport (YYZ), Silver Dart Drive, Mississauga, ON, Canada'
    ): Chainable<void>;
    userExists(email: string, password: string, org: boolean = true): Chainable<any>;
    getDocument(path: string, idToken: string): Chainable<{ [k: string]: any }>;
    resetAndSeed(): Chainable<void>;
    seedAuthEmulator(): Chainable<void>;
    getStorageFile(path: string): Chainable<any>;
    recivedOobCode(email: string): Chainable<void>;
  }

  interface cypressUser {
    email: string;
    password: string;
  }
}
