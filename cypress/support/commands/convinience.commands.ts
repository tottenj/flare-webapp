/// <reference types="cypress" />

import { nonPendingOrg, pendingOrg, userEmailVerified, admin } from '../../../__tests__/e2e/constants';

Cypress.Commands.add('loginTestUser', () => {
  cy.loginUser(userEmailVerified.email, userEmailVerified.password);
});

Cypress.Commands.add('loginTestOrg', () => {
  cy.loginUser(pendingOrg.email, pendingOrg.password);
});

Cypress.Commands.add('loginTestOrgClient', () => {
  cy.clientLogin(pendingOrg.email, pendingOrg.password);
});

Cypress.Commands.add('loginVerifiedOrg', () => {
  cy.loginUser(nonPendingOrg.email, nonPendingOrg.password);
});


Cypress.Commands.add('loginTestAdmin', () => {
  cy.loginUser(admin.email, admin.password);
})
