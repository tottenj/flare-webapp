import { seededEvents } from '../constants';

const editableEvent = seededEvents.editable;
const editableCategoryLabel = 'Nightlife';
const editableAgeRestrictionLabel = '19+';

const updatedEvent = {
  title: 'Updated Seed Event',
  description: 'Updated seeded event description',
  startDateTime: {
    month: '06',
    day: '15',
    year: '2031',
    hour: '08',
    minute: '45',
    period: 'PM',
  },
  endDateTime: {
    month: '06',
    day: '15',
    year: '2031',
    hour: '10',
    minute: '15',
    period: 'PM',
  },
} as const;

function assertHeroDateTime(
  selector: string,
  value: { month: string; day: string; year: string; hour: string; minute: string; period: string }
) {
  cy.get(`${selector} [data-type="month"]`).should('contain.text', value.month);
  cy.get(`${selector} [data-type="day"]`).should('contain.text', value.day);
  cy.get(`${selector} [data-type="year"]`).should('contain.text', value.year);
  cy.get(`${selector} [data-type="hour"]`).should('contain.text', value.hour);
  cy.get(`${selector} [data-type="minute"]`).should('contain.text', value.minute);
  cy.get(`${selector} [data-type="dayPeriod"]`).should('contain.text', value.period);
}

function openEditForm(title: string) {
  cy.get('[data-cy="tab-published"]').click();
  cy.get('[data-cy="my-events-container"]')
    .contains('h3', title)
    .closest('div.group')
    .as('eventRow');
  cy.get('@eventRow').trigger('mouseover');
  cy.get('@eventRow').within(() => {
    cy.get('button').click({ force: true });
  });
  cy.contains('Preview Changes').should('exist').scrollIntoView();
}

describe('Edit Event', () => {
  beforeEach(() => {
    cy.resetAndSeed();
    cy.loginTestOrg();
    cy.reload();
    cy.visit('/dashboard');
    cy.loginTestOrgClient();
  });

  it('loads all existing event fields and saves updates successfully', () => {
    openEditForm(editableEvent.title);

    cy.get('[data-cy="main-modal"]').within(() => {
      cy.get('img').first().invoke('attr', 'src').should('not.contain', 'imagePlaceholder.png');
      cy.get('[data-cy="eventName-input"]').should('have.value', editableEvent.title);
      cy.get('[data-cy="eventDescription-input"]').should('have.value', editableEvent.description);
      cy.get('[data-cy="location-input"]').should('have.value', editableEvent.location.address);
      cy.contains(editableEvent.tags[0].label, { matchCase: false }).should('exist');
      cy.contains(editableEvent.tags[1].label, { matchCase: false }).should('exist');
      cy.contains(editableCategoryLabel).should('exist');
      cy.contains(editableAgeRestrictionLabel).should('exist');
      cy.contains('Range').should('exist');
      cy.get('[data-cy="minPrice-input"]').invoke('val').should('contain', '15');
      cy.get('[data-cy="maxPrice-input"]').invoke('val').should('contain', '45');
    });

    assertHeroDateTime('[data-cy="startDateTime-input"]', {
      month: '05',
      day: '10',
      year: '2030',
      hour: '07',
      minute: '30',
      period: 'PM',
    });
    cy.get('[data-cy="endTime-input"]').should('exist');
    assertHeroDateTime('[data-cy="endDateTime-input"]', {
      month: '05',
      day: '10',
      year: '2030',
      hour: '09',
      minute: '00',
      period: 'PM',
    });

    cy.get('[data-cy="eventName-input"]').clear().type(updatedEvent.title);
    cy.get('[data-cy="eventDescription-input"]').clear().type(updatedEvent.description);
    cy.get('[data-cy="location-input"]').clear();
    cy.usePlacesInput('[data-cy="location-input"]');
    cy.get('[data-cy="image-input"]').selectFile('cypress/fixtures/stockEvent.jpg', {
      force: true,
    });
    cy.contains('Confirm Crop').should('be.visible').click();

    cy.fillHeroDateTime('[data-cy="startDateTime-input"]', updatedEvent.startDateTime);
    cy.fillHeroDateTime('[data-cy="endDateTime-input"]', updatedEvent.endDateTime);

    cy.contains('Preview Changes').scrollIntoView().click({ force: true });
    cy.contains('Save Changes').scrollIntoView().click({ force: true });
    cy.contains('.Toastify__toast', 'Updated Event', { timeout: 10000 }).should('be.visible');

    cy.get('[data-cy="my-events-container"]').within(() => {
      cy.contains(updatedEvent.title).should('be.visible');
      cy.contains(editableEvent.title).should('not.exist');
    });

    cy.get(`[aria-label="${updatedEvent.title}"]`).click();
    cy.get(`[data-cy="${updatedEvent.title}-event-modal"]`).within(() => {
      cy.contains(updatedEvent.title).should('be.visible');
      cy.contains(updatedEvent.description).should('be.visible');
      cy.contains('CN Tower, Toronto').should('be.visible');
    });
  });
});
