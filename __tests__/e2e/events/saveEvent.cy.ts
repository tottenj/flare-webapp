import { seededEvents } from '../constants';

describe('Save Event', () => {
  beforeEach(() => {
    cy.resetAndSeed();
    cy.seedAuthEmulator();
    cy.seedStorageEmulator();
  });

  it('lets a non-owner user save and unsave a published event', () => {
    cy.loginTestUser();
    cy.visit(`/event/${seededEvents.verifiedPublished.id}?returnTo=/events`);

    cy.get(`[data-cy="${seededEvents.verifiedPublished.title}-event-modal"]`).should('be.visible');
    cy.get('[data-cy="save-event-button"]')
      .should('be.visible')
      .and('have.attr', 'aria-label', 'Save event')
      .click();

    cy.contains('.Toastify__toast', 'Saved Event', { timeout: 10000 }).should('be.visible');

    cy.get('[data-cy="save-event-button"]')
      .should('have.attr', 'aria-label', 'Remove from saved events')
      .and('have.attr', 'aria-pressed', 'true');

    cy.reload();

    cy.get('[data-cy="save-event-button"]')
      .should('be.visible')
      .and('have.attr', 'aria-label', 'Remove from saved events')
      .click();

    cy.contains('.Toastify__toast', 'Removed from Saved Events', { timeout: 10000 }).should(
      'be.visible'
    );

    cy.reload();

    cy.get('[data-cy="save-event-button"]')
      .should('be.visible')
      .and('have.attr', 'aria-label', 'Save event')
      .and('have.attr', 'aria-pressed', 'false');
  });

  it('hides the save button for the owner org viewing its own event', () => {
    cy.loginTestOrg();
    cy.loginTestOrgClient();
    cy.visit(`/event/${seededEvents.upcoming.id}?returnTo=/dashboard`);

    cy.get(`[data-cy="${seededEvents.upcoming.title}-event-modal"]`).should('be.visible');
    cy.get('[data-cy="save-event-button"]').should('not.exist');
  });

  it('hides the save button for logged out users', () => {
    cy.visit(`/event/${seededEvents.verifiedPublished.id}?returnTo=/events`);

    cy.get(`[data-cy="${seededEvents.verifiedPublished.title}-event-modal"]`).should('be.visible');
    cy.get('[data-cy="save-event-button"]').should('not.exist');
  });
});
