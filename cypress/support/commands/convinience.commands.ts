/// <reference types="cypress" />

Cypress.Commands.add('loginTestUser', () => {
  cy.loginUser('userOne@gmail.com', 'password');
});

Cypress.Commands.add('loginTestOrg', () => {
  cy.loginUser('orgOne@gmail.com', 'password');
});

Cypress.Commands.add('loginVerifiedOrg', () => {
  cy.loginUser('verifiedOrg@gmail.com', 'password');
});
