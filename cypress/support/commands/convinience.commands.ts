/// <reference types="cypress" />

Cypress.Commands.add('loginTestUser', () => {
  cy.loginUser('user@gmail.com', 'password123');
});

Cypress.Commands.add('loginTestOrg', () => {
  cy.loginUser('unverifiedOrg@gmail.com', 'password123');
});

Cypress.Commands.add('loginVerifiedOrg', () => {
  cy.loginUser('verifiedOrg@gmail.com', 'password123');
});
