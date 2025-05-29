// cypress/support/types.d.ts
declare namespace Cypress {

  interface Chainable {
    createUser(email: string, password: string, verified:boolean = false): Chainable<Cypress.Response<any>>;
    loginUser(email: string, password: string): Chainable<Cypress.Response<any>>;
    clearFirestoreEmulators(): Chainable<Cypress.Response<any>>;
    clearAllEmulators(): Chainable<Cypress.Response<any>>;
    clearAuthEmulator(): Chainable<Cypress.Response<any>>
  }

}
