import {
  closeFilterChip,
  closeEventFilters,
  clearFilters,
  expectCategoryFilteredList,
  expectDefaultUnfilteredList,
  expectFilterChip,
  expectPearsonDistanceFilteredList,
  expectNoFilterChip,
  openEventFilters,
  selectCategoryFilter,
  setDistanceFilter,
  expectNightlifePearsonDistanceFilteredList,
} from './filterTestHelpers';
import { seededLocations } from '../constants';

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
    closeEventFilters();

    cy.url().should('include', 'category=NIGHTLIFE');
    expectFilterChip('category', 'Nightlife');
    expectNoFilterChip('distance');
    expectCategoryFilteredList();
  });

  it('clears category filter and restores default list', () => {
    expectDefaultUnfilteredList();

    openEventFilters();
    selectCategoryFilter('Nightlife');
    closeEventFilters();
    cy.url().should('include', 'category=NIGHTLIFE');
    expectFilterChip('category', 'Nightlife');
    expectCategoryFilteredList();

    openEventFilters();
    clearFilters();
    cy.url().should('not.include', 'category=');
    expectNoFilterChip('category');
    expectDefaultUnfilteredList();
  });

  it('shows location chip when location filter is selected', () => {
    expectDefaultUnfilteredList();

    openEventFilters();
    cy.usePlacesInput('[data-cy="main-modal"] [data-cy="location-input"]');
    closeEventFilters();

    cy.url().should('include', 'placeId=');
    expectFilterChip('placeId');
    expectNoFilterChip('distance');
    expectDefaultUnfilteredList();
  });

  it('allows setting distance when location is selected', () => {
    cy.visit(`/events?placeId=${seededLocations.primary.placeId}`);

    cy.url().should('include', `placeId=${seededLocations.primary.placeId}`);
    expectFilterChip('placeId');

    openEventFilters();
    setDistanceFilter(25);
    closeEventFilters();

    cy.url().should('include', `placeId=${seededLocations.primary.placeId}`);
    cy.url().should('include', 'distance=25');
    expectFilterChip('placeId');
    expectNoFilterChip('distance');
    expectPearsonDistanceFilteredList();
  });

  it('keeps location chip and does not expose distance chip in current distance flow', () => {
    cy.visit(`/events?placeId=${seededLocations.primary.placeId}&distance=25`);

    cy.url().should('include', 'placeId=');
    cy.url().should('include', 'distance=');
    expectFilterChip('placeId');
    expectNoFilterChip('distance');
    expectPearsonDistanceFilteredList();
  });

  it('works with multiple filters applied', () => {
    cy.visit(`/events?category=NIGHTLIFE&placeId=${seededLocations.primary.placeId}&distance=25`);

    cy.url().should('include', 'category=NIGHTLIFE');
    cy.url().should('include', `placeId=${seededLocations.primary.placeId}`);
    cy.url().should('include', 'distance=');
    expectFilterChip('category', 'Nightlife');
    expectFilterChip('placeId');
    expectNoFilterChip('distance');
    expectNightlifePearsonDistanceFilteredList();
  });

  it('removes only the filter if same value chosen again', () => {
    cy.visit(`/events?category=NIGHTLIFE&placeId=${seededLocations.primary.placeId}`);

    expectCategoryFilteredList();

    openEventFilters();
    selectCategoryFilter('Nightlife');
    closeEventFilters();

    cy.url().should('not.include', 'category=');
    expectNoFilterChip('category');

    cy.url().should('include', `placeId=${seededLocations.primary.placeId}`);
    expectFilterChip('placeId');
    expectDefaultUnfilteredList();
  });

  it('removes active chips via chip close buttons', () => {
    expectDefaultUnfilteredList();

    openEventFilters();
    selectCategoryFilter('Nightlife');
    cy.usePlacesInput('[data-cy="main-modal"] [data-cy="location-input"]');
    closeEventFilters();

    expectFilterChip('category', 'Nightlife');
    expectFilterChip('placeId');
    expectCategoryFilteredList();

    closeFilterChip('category');
    cy.url().should('not.include', 'category=');
    expectNoFilterChip('category');
    expectFilterChip('placeId');
    cy.url().should('include', 'placeId=');
    expectDefaultUnfilteredList();

    closeFilterChip('placeId');
    cy.url().should('not.include', 'placeId=');
    expectNoFilterChip('placeId');
    expectDefaultUnfilteredList();
  });

  it('clears location filters while distance remains absent from URL and chips', () => {
    cy.visit(`/events?placeId=${seededLocations.primary.placeId}&distance=25`);

    cy.url().should('include', 'placeId=');
    cy.url().should('include', 'distance=');
    expectFilterChip('placeId');
    expectNoFilterChip('distance');
    expectPearsonDistanceFilteredList();

    openEventFilters();
    clearFilters();

    cy.url().should('not.include', 'placeId=');
    cy.url().should('not.include', 'distance=');
    expectNoFilterChip('placeId');
    expectNoFilterChip('distance');
    expectDefaultUnfilteredList();
  });
});
