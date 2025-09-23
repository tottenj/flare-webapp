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
    loginUser(email: string, password: string): Chainable<null>;
    createAndLoginUser(
      email?: string,
      password?: string,
      name?: string
    ): Chainable<Cypress.Response<any>>;
    createAndLoginOrganization(
      email?: string,
      password?: string,
      name?: string
    ): Chainable<Cypress.Response<any>>;
    clearFirestoreEmulators(): Chainable<Cypress.Response<any>>;
    clearAuthEmulator(): Chainable<Cypress.Response<any>>;
    clearAllEmulators(): Chainable<Cypress.Response<any>>;
    logoutUser(): Chainable<Cypress.Response<any>>;
    createAndLoginUser(
      email?: string,
      password?: string,
      name?: string
    ): Chainable<Cypress.Response<any>>;
    seedDb(): Chainable<Cypress.Response<any>>;
    loginTestUser(): Chainable<void>;
    loginTestOrg(): Chainable<void>;
    checkToast(message: string): Chainable<Cypress.Response<any>>;
    checkExistance(ffuncs: Record<string, () => Cypress.Chainable>): Chainable<void>;
    clearForm(): Chainable<void>;
    usePlacesInput(
      selector: string,
      loc: string = verifiedOrg.location.name,
      contains: string = 'Toronto Pearson International Airport (YYZ), Silver Dart Drive, Mississauga, ON, Canada'
    ): Chainable<void>;
    userExists(email:string): Chainable<boolean>
    waitForFirestoreEmulator(): Chainable<void>
    waitForAuthEmulator(): Chainable<void>
    waitForEmulators(): Chainable<void>
    getDocument(path:string): Chainable<Response<any>>
  }


  interface cypressUser{
    email: string,
    password: string
  }

}
