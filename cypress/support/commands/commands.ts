/// <reference types="cypress" />

import { storageEms } from "./env";

Cypress.Commands.add(
  'usePlacesInput',
  (
    selector: string,
    loc: string = 'Toronto Pearson International Airport',
    contains: string = 'Toronto Pearson International Airport (YYZ), Silver Dart Drive, Mississauga, ON, Canada'
  ) => {
    const location = cy.get(selector);
    const newContains = 'CN Tower, Toronto';
    //cy.intercept('POST', '**/places.googleapis.com/**').as('places');
    location.type(loc);
    cy.contains(newContains).should('exist');
    //cy.wait('@places');
    cy.get('ul[role="listbox"] li[role="option"]')
      .contains(newContains)
      .should('be.visible')
      .click({ force: true });
  }
);

Cypress.Commands.add(
  'userExists',
  (email: string, password: string, shouldExist: boolean = true) => {
    return cy.loginUser(email, password).then((resp) => {
      if (shouldExist) {
        expect(resp.body.localId).to.not.be.null;
        expect(resp.body.localId).to.not.be.undefined;
      } else {
        expect(resp.body.localId).to.be.null;
        expect(resp.body.localId).to.be.undefined;
      }
      return resp.body;
    });
  }
);



Cypress.Commands.add('getStorageFile', (path: string) => {
  const encodedPath = encodeURIComponent(path);
  const url = `${storageEms}/${encodedPath}`;

  const MAX_RETRIES = 10; // same as your Firestore helper
  const DELAY_MS = 500;

  const attempt = (retryCount: number): Cypress.Chainable<any> => {
    return cy
      .request({
        method: 'GET',
        url,
        failOnStatusCode: false, // allow 404 on missing file
      })
      .then((resp) => {
        if (resp.status === 200) {
          return resp.body; // ✅ File metadata found
        } else if (retryCount > 0) {
          cy.wait(DELAY_MS);
          return attempt(retryCount - 1); // 🔁 retry
        } else {
          throw new Error(`Storage file "${path}" not found after ${MAX_RETRIES} retries`);
        }
      });
  };

  return attempt(MAX_RETRIES);
});
