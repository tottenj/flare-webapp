import { pendingOrg } from '../constants';
import { SEEDED_TEST_LOCATIONS, SEEDED_TEST_ORGS } from '../../../prisma/seedTest.constants';

const pendingOrgId = SEEDED_TEST_ORGS.pendingOrg.id;

describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.loginTestAdmin();
    cy.visit('/dashboard');
  });

  it('shows unverified organizations with the proper org card details', () => {
    cy.get('[data-cy="admin-unverified-orgs-section"]').should('be.visible');
    cy.get('[data-cy="admin-unverified-orgs-title"]').should(
      'contain.text',
      'Unverified Organizations'
    );

    cy.get(`[data-cy="admin-org-card-${pendingOrgId}"]`)
      .should('be.visible')
      .within(() => {
        cy.contains(pendingOrg.orgName).should('be.visible');
        cy.contains(SEEDED_TEST_LOCATIONS.primary.address).should('be.visible');
      });
  });

  it('opens org modal from card click and shows the correct pending org details', () => {
    cy.get(`[data-cy="admin-org-card-${pendingOrgId}"]`).click();

    cy.url().should('include', `/admin/org/${pendingOrgId}`);
    cy.get('[data-cy="main-modal"]').should('be.visible');

    cy.get('[data-cy="admin-org-details"]').within(() => {
      cy.contains(pendingOrg.orgName).should('be.visible');
      cy.contains(SEEDED_TEST_LOCATIONS.primary.address).should('be.visible');
      cy.get('[data-cy="admin-org-contact-email"]').should('contain.text', pendingOrg.email);
      cy.get('[data-cy="admin-org-no-socials"]').should('be.visible');
      cy.get('[data-cy="admin-org-no-proofs"]').should('be.visible');
    });

    cy.get('[data-cy="verify-org-button"]').should('be.visible');
  });

  it('opens org modal from direct url and closes back to dashboard', () => {
    cy.visit(`/admin/org/${pendingOrgId}?returnTo=/dashboard`);

    cy.url().should('include', `/admin/org/${pendingOrgId}`);
    cy.get('[data-cy="main-modal"]').should('be.visible');
    cy.get('[data-cy="admin-org-details"]').should('be.visible');

    cy.get('button[aria-label="Close"]').click();

    cy.url().should('include', '/dashboard');
    cy.url().should('not.include', '/admin/org/');
  });

  it('closes the org modal and returns to dashboard', () => {
    cy.get(`[data-cy="admin-org-card-${pendingOrgId}"]`).click();
    cy.get('[data-cy="main-modal"]').should('be.visible');

    cy.get('button[aria-label="Close"]').click();

    cy.url().should('include', '/dashboard');
    cy.url().should('not.include', '/admin/org/');
    cy.get('[data-cy="main-modal"]').should('not.be.visible');
  });

  it('verifies a pending org and removes it from the unverified list', () => {
    cy.get(`[data-cy="admin-org-card-${pendingOrgId}"]`).click();
    cy.get('[data-cy="main-modal"]').should('be.visible');

    cy.get('[data-cy="verify-org-button"]').click();

    cy.contains('.Toastify__toast', 'Organization verified', {
      timeout: 15000,
    }).should('be.visible');

    cy.get('[data-cy="admin-org-details"]').should('not.exist');
    cy.get('[data-cy="verify-org-button"]').should('not.exist');
    cy.get('[data-cy="admin-org-not-found"]').should('be.visible');

    cy.get('button[aria-label="Close"]').click();

    cy.url().should('include', '/dashboard');
    cy.get(`[data-cy="admin-org-card-${pendingOrgId}"]`).should('not.exist');

    cy.reload();
    cy.get(`[data-cy="admin-org-card-${pendingOrgId}"]`).should('not.exist');
  });

  after(() => {
    cy.clearAllEmulators();
    cy.resetAndSeed();
    cy.seedAuthEmulator();
    cy.seedStorageEmulator();
    cy.then(() => {
      Cypress.session.clearAllSavedSessions();
    });
  });
});
