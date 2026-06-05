import { seededEvents } from '../constants';

export function openEventFilters() {
  cy.get('[data-cy="events-filter-trigger"]').should('be.visible').click();
  cy.get('[data-cy="main-modal"]')
    .should('be.visible')
    .contains('Event Filters')
    .should('be.visible');
}

export function selectCategoryFilter(label: string) {
  cy.get('[data-cy="main-modal"]').should('be.visible');
  cy.get('[data-cy="main-modal"] [data-cy="filter-category-select"]')
    .find('button[aria-haspopup="listbox"],button,[role="button"]')
    .first()
    .click()
    .invoke('attr', 'aria-controls')
    .then((listboxId) => {
      expect(listboxId, 'category listbox id').to.be.a('string').and.not.be.empty;
      cy.get(`#${String(listboxId)}`, { timeout: 10000 })
        .should('be.visible')
        .contains(label)
        .click();
    });
}

export function clearFilters() {
  cy.contains('button', 'Clear Filters').click({ force: true });
  cy.get('[data-cy="main-modal"] [aria-label="Close"]').first().click({ force: true });
  cy.contains('Event Filters').should('not.exist');
}

export function expectCategoryFilteredList() {
  cy.get(`[data-cy="event-row-${seededEvents.verifiedUpcoming.id}"]`).should('exist');
  cy.get(`[data-cy="event-row-${seededEvents.verifiedPublished.id}"]`).should('not.exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterSocialHarbourfront.id}"]`).should('not.exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterCultureNorthYork.id}"]`).should('not.exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterWellnessScarborough.id}"]`).should('not.exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterAdvocacyPearson.id}"]`).should('not.exist');
}

export function expectDefaultUnfilteredList() {
  cy.get(`[data-cy="event-row-${seededEvents.verifiedUpcoming.id}"]`).should('exist');
  cy.get(`[data-cy="event-row-${seededEvents.verifiedPublished.id}"]`).should('exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterSocialHarbourfront.id}"]`).should('exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterCultureNorthYork.id}"]`).should('exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterWellnessScarborough.id}"]`).should('exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterAdvocacyPearson.id}"]`).should('exist');

  // Pending org fixtures should never appear in public events.
  cy.get(`[data-cy="event-row-${seededEvents.filterOtherPendingOrg.id}"]`).should('not.exist');
}
