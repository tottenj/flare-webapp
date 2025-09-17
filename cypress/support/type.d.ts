// cypress/support/types.d.ts
declare namespace Cypress {

  interface Chainable {
    createUser(email: string, password: string, name: string, emailVerified?: boolean, org?: boolean): Chainable<{uid: string; email: string; password: string; name: string;[key: string]: any;}>;
    loginUser(email: string, password: string): Chainable<null>;
    createAndLoginUser(email?: string, password?: string, name?: string): Chainable<Cypress.Response<any>>;
    createAndLoginOrganization(email?: string, password?: string, name?: string): Chainable<Cypress.Response<any>>;
    clearFirestoreEmulators(): Chainable<Cypress.Response<any>>;
    clearAuthEmulator(): Chainable<Cypress.Response<any>>;
    clearAllEmulators(): Chainable<Cypress.Response<any>>;
    logoutUser(): Chainable<Cypress.Response<any>>;
    createAndLoginUser(email?:string, password?:string, name?:string): Chainable<Cypress.Response<any>>
  }


  interface cypressUser{
    email: string,
    password: string
  }

}
