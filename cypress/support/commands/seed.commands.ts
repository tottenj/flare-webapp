/// <reference types="cypress" />

import { AUTH_ADMIN } from './env';

Cypress.Commands.add('clearAllEmulators', () => {
  cy.clearAuth();
  //cy.clearStorage()
});

Cypress.Commands.add('clearAuth', () => {
  cy.request('DELETE', `${AUTH_ADMIN}/accounts`).then((response) => {
    expect(response.status).to.eq(200);
  });
});




Cypress.Commands.add('seedDb', (maxRetries = 5) => {
  const attemptSeed = (retryCount = 0): Cypress.Chainable<any> => {
    return cy
      .request({
        method: 'POST',
        url: 'http://127.0.0.1:5001/flare-7091a/us-central1/seedDb',
        failOnStatusCode: false,
        timeout: 10000,
        body: {
          data: {},
        },
      })
      .then((response) => {
        if (
          response.status === 200 &&
          response.body.result &&
          response.body.result.success === true
        ) {
          cy.log('✅ Database seeded successfully');
          return cy.wrap(response.body.result);
        } else if (retryCount < maxRetries) {
          cy.log(`⏳ Seed failed (attempt ${retryCount + 1}/${maxRetries}), retrying...`);
          // It's good practice to chain cy.wait and then call the next attempt
          return cy.wait(2000).then(() => attemptSeed(retryCount + 1));
        } else {
          throw new Error(
            `Failed to seed database after ${maxRetries} attempts. Status: ${response.status}. Response: ${JSON.stringify(response.body)}`
          );
        }
      });
  };

  return attemptSeed();
});

Cypress.Commands.add('resetAndSeed', () => {
  cy.task('db:resetAndSeed');
});

Cypress.Commands.add('seedAuthEmulator', () => {
  const functionsUrl = `${Cypress.env('FUNCTIONS_URL')}/${Cypress.env('NEXT_PUBLIC_FIREBASE_PROJECT_ID')}/us-central1/seedAuthEmulator`;

  cy.request('POST', functionsUrl).then((response) => {
    cy.log(functionsUrl);
    cy.log(JSON.stringify(response.body));
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('success', true);
  });
});
