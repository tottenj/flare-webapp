import { seededEvents, userEmailVerified } from '../constants';

describe('User Dashboard', () => {
  before(() => {
    cy.resetAndSeed();
    cy.seedAuthEmulator();
    cy.seedStorageEmulator();
    cy.then(() => {
      Cypress.session.clearAllSavedSessions();
    });
  });

  beforeEach(() => {
    cy.loginTestUser();
    cy.visit('/dashboard');
  });

  it('loads user dashboard with profile and saved events section', () => {
    cy.contains(userEmailVerified.email).should('be.visible');
    cy.get('[data-cy="profile-picture"]').should('be.visible');

    cy.get('[data-cy="saved-events-container"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Saved Events').should('be.visible');
      });
  });

  it('does not list an event after it is unsaved', () => {
    cy.visit(`/event/${seededEvents.verifiedPublished.id}?returnTo=/dashboard`);

    cy.get(`[data-cy="${seededEvents.verifiedPublished.title}-event-modal"]`).should('be.visible');
    cy.get('[data-cy="save-event-button"]')
      .invoke('attr', 'aria-label')
      .then((ariaLabel) => {
        if (ariaLabel === 'Remove from saved events') {
          cy.get('[data-cy="save-event-button"]').click();
          cy.contains('.Toastify__toast', 'Removed from Saved Events', { timeout: 10000 }).should(
            'be.visible'
          );
        }
      });

    cy.visit('/dashboard');
    cy.get('[data-cy="saved-events-container"]').within(() => {
      cy.get(`[data-cy="event-row-${seededEvents.verifiedPublished.id}"]`).should('not.exist');
    });
  });

  it('shows a saved event on the dashboard after saving it', () => {
    cy.visit(`/event/${seededEvents.verifiedPublished.id}?returnTo=/dashboard`);

    cy.get(`[data-cy="${seededEvents.verifiedPublished.title}-event-modal"]`).should('be.visible');
    cy.get('[data-cy="save-event-button"]').should('have.attr', 'aria-label', 'Save event').click();

    cy.contains('.Toastify__toast', 'Saved Event', { timeout: 10000 }).should('be.visible');

    cy.visit('/dashboard');
    cy.get('[data-cy="saved-events-container"]').within(() => {
      cy.get(`[data-cy="event-row-${seededEvents.verifiedPublished.id}"]`).should('be.visible');
      cy.contains(seededEvents.verifiedPublished.title).should('be.visible');
    });
  });
});
