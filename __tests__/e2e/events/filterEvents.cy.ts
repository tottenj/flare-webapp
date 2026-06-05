import {
  clearFilters,
  expectCategoryFilteredList,
  expectDefaultUnfilteredList,
  openEventFilters,
  selectCategoryFilter,
} from './filterTestHelpers';

describe('Event Filters', () => {
  beforeEach(() => {
    cy.resetAndSeed();
    cy.seedAuthEmulator();
    cy.seedStorageEmulator();
    cy.visit('/events');
  });

  it('filters events by category and updates query params', () => {
    expectDefaultUnfilteredList();

    openEventFilters();
    selectCategoryFilter('Nightlife');

    cy.url().should('include', 'category=NIGHTLIFE');
    expectCategoryFilteredList();
  });

  it('clears category filter and restores default list', () => {
    openEventFilters();
    selectCategoryFilter('Nightlife');
    cy.url().should('include', 'category=NIGHTLIFE');
    expectCategoryFilteredList();

    clearFilters();
    cy.url().should('not.include', 'category=');
    expectDefaultUnfilteredList();
  });
});
