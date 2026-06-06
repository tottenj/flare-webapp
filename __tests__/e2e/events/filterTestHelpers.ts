import { seededEvents } from '../constants';

export function openEventFilters() {
  cy.get('[data-cy="events-filter-trigger"]', { timeout: 10000 })
    .should('be.visible')
    .scrollIntoView()
    .click({ force: true });

  cy.get('[data-cy="main-modal"]', { timeout: 10000 })
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

export function closeEventFilters() {
  cy.get('[data-cy="main-modal"] [aria-label="Close"]', { timeout: 10000 })
    .first()
    .click({ force: true });

  cy.get('[data-cy="main-modal"]', { timeout: 10000 }).should('not.exist');
}

export function clearFilters() {
  cy.contains('button', 'Clear Filters').click({ force: true });
  closeEventFilters();
}

export function setDistanceFilter(kilometers: number) {
  cy.get('[data-cy="main-modal"]').should('be.visible');
  cy.get('[data-cy="main-modal"]').then(($modal) => {
    const rangeInput = $modal.find('input[type="range"]');

    if (rangeInput.length > 0) {
      cy.wrap(rangeInput[0])
        .invoke('val')
        .then((current) => {
          const currentNumber = Number(current ?? '10');
          const delta = kilometers - currentNumber;
          if (delta === 0) return;

          const keyStroke = delta > 0 ? '{rightarrow}' : '{leftarrow}';
          const steps = Math.abs(delta);
          const keys = Array.from({ length: steps }, () => keyStroke).join('');

          cy.wrap(rangeInput[0]).focus().type(keys, { force: true });
        });
      return;
    }

    cy.get('[data-cy="main-modal"] [role="slider"]').first().as('distanceSlider');

    cy.get('@distanceSlider')
      .invoke('attr', 'aria-valuenow')
      .then((current) => {
        const currentNumber = Number(current ?? '10');
        const delta = kilometers - currentNumber;
        if (delta === 0) return;

        const keyStroke = delta > 0 ? '{rightarrow}' : '{leftarrow}';
        const steps = Math.abs(delta);
        const keys = Array.from({ length: steps }, () => keyStroke).join('');

        cy.get('@distanceSlider').focus().type(keys, { force: true });
      });
  });
}

export function expectFilterChip(key: string, expectedText?: string) {
  const chipSelector = `[data-cy="events-filter-chip-${key}"]`;
  cy.get(chipSelector).should('be.visible');

  if (expectedText) {
    cy.get(chipSelector)
      .invoke('text')
      .then((text) => {
        expect(text.toLowerCase()).to.contain(expectedText.toLowerCase());
      });
  }
}

export function expectNoFilterChip(key: string) {
  cy.get(`[data-cy="events-filter-chip-${key}"]`).should('not.exist');
}

export function closeFilterChip(key: string) {
  const chipSelector = `[data-cy="events-filter-chip-${key}"]`;
  cy.get(chipSelector)
    .should('be.visible')
    .within(() => {
      cy.get('[aria-label="close chip"]').first().click({ force: true });
    });
}

export function expectCategoryFilteredList() {
  cy.get(`[data-cy="event-row-${seededEvents.verifiedUpcoming.id}"]`, { timeout: 12000 }).should(
    'exist'
  );
  cy.get(`[data-cy="event-row-${seededEvents.verifiedPublished.id}"]`, { timeout: 12000 }).should(
    'not.exist'
  );
  cy.get(`[data-cy="event-row-${seededEvents.filterSocialHarbourfront.id}"]`, {
    timeout: 12000,
  }).should('not.exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterCultureNorthYork.id}"]`, {
    timeout: 12000,
  }).should('not.exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterWellnessScarborough.id}"]`, {
    timeout: 12000,
  }).should('not.exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterAdvocacyPearson.id}"]`, {
    timeout: 12000,
  }).should('not.exist');
}

export function expectDefaultUnfilteredList() {
  cy.get(`[data-cy="event-row-${seededEvents.verifiedUpcoming.id}"]`, { timeout: 12000 }).should(
    'exist'
  );
  cy.get(`[data-cy="event-row-${seededEvents.verifiedPublished.id}"]`, { timeout: 12000 }).should(
    'exist'
  );
  cy.get(`[data-cy="event-row-${seededEvents.filterSocialHarbourfront.id}"]`, {
    timeout: 12000,
  }).should('exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterCultureNorthYork.id}"]`, {
    timeout: 12000,
  }).should('exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterWellnessScarborough.id}"]`, {
    timeout: 12000,
  }).should('exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterAdvocacyPearson.id}"]`, {
    timeout: 12000,
  }).should('exist');

  // Pending org fixtures should never appear in public events.
  cy.get(`[data-cy="event-row-${seededEvents.filterOtherPendingOrg.id}"]`, {
    timeout: 12000,
  }).should('not.exist');
}

export function expectPearsonDistanceFilteredList() {
  cy.get(`[data-cy="event-row-${seededEvents.verifiedUpcoming.id}"]`, { timeout: 12000 }).should(
    'exist'
  );
  cy.get(`[data-cy="event-row-${seededEvents.verifiedPublished.id}"]`, { timeout: 12000 }).should(
    'exist'
  );
  cy.get(`[data-cy="event-row-${seededEvents.filterSocialHarbourfront.id}"]`, {
    timeout: 12000,
  }).should('exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterCultureNorthYork.id}"]`, {
    timeout: 12000,
  }).should('exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterAdvocacyPearson.id}"]`, {
    timeout: 12000,
  }).should('exist');

  cy.get(`[data-cy="event-row-${seededEvents.filterWellnessScarborough.id}"]`, {
    timeout: 12000,
  }).should('not.exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterOtherPendingOrg.id}"]`, {
    timeout: 12000,
  }).should('not.exist');
}

export function expectNightlifePearsonDistanceFilteredList() {
  cy.get(`[data-cy="event-row-${seededEvents.verifiedUpcoming.id}"]`, { timeout: 12000 }).should(
    'exist'
  );

  cy.get(`[data-cy="event-row-${seededEvents.verifiedPublished.id}"]`, { timeout: 12000 }).should(
    'not.exist'
  );
  cy.get(`[data-cy="event-row-${seededEvents.filterAdvocacyPearson.id}"]`, {
    timeout: 12000,
  }).should('not.exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterSocialHarbourfront.id}"]`, {
    timeout: 12000,
  }).should('not.exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterCultureNorthYork.id}"]`, {
    timeout: 12000,
  }).should('not.exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterWellnessScarborough.id}"]`, {
    timeout: 12000,
  }).should('not.exist');
  cy.get(`[data-cy="event-row-${seededEvents.filterOtherPendingOrg.id}"]`, {
    timeout: 12000,
  }).should('not.exist');
}
