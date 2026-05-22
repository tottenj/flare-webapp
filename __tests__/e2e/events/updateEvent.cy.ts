import { seededEvents } from '../constants';

const editableEvent = seededEvents.editable;
const editableCategoryLabel = 'Nightlife';
const editableAgeRestrictionLabel = '19+';
const MODAL_LOAD_TIMEOUT_MS = 10000;

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
  cy.get('[data-cy="tab-published"]').click({ force: true });
  cy.get(`[aria-label="${title}"]`)
    .should('have.attr', 'href')
    .then((href) => {
      // Strip query string so we get the bare event ID (e.g. "eventEditable")
      const rawSegment = String(href).split('/').pop() ?? '';
      const eventId = rawSegment.split('?')[0];
      cy.get(`[data-cy="event-row-${eventId}"]`).as('eventRow');
      cy.get('@eventRow')
        .find(`[data-cy="edit-event-trigger-${eventId}"]:visible`)
        .as('editTrigger');
    });

  // group-hover:block is CSS-only and not triggered by synthetic events;
  // force:true bypasses the visibility check and clicks the hidden button directly.
  cy.get('@editTrigger').click({ force: true });
  cy.contains('Preview Changes', { timeout: MODAL_LOAD_TIMEOUT_MS })
    .should('exist')
    .scrollIntoView();
}

function setTagsInHiddenInput(tags: string[]) {
  // Autocomplete interactions are async and can be flaky in CI; setting the hidden tags
  // input keeps this test focused on updateEvent persistence semantics.
  cy.get('input[name="tags"]').should('exist').invoke('val', JSON.stringify(tags));
}

function previewAndSaveChanges() {
  cy.contains('Preview Changes').scrollIntoView().click({ force: true });
  cy.contains('Save Changes').scrollIntoView().click({ force: true });
  cy.contains('.Toastify__toast', 'Updated Event', { timeout: 10000 }).should('be.visible');
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

    cy.get('[data-cy="main-modal"]:visible').within(() => {
      cy.get('img').first().invoke('attr', 'src').should('not.contain', 'imagePlaceholder.png');
      cy.get('[data-cy="eventName-input"]').should('have.value', editableEvent.title);
      cy.get('[data-cy="eventDescription-input"]').should('have.value', editableEvent.description);
      cy.get('[data-cy="location-input"]').should('have.value', editableEvent.location.address);
      cy.contains(editableEvent.tags[0].label, { matchCase: false }).should('exist');
      cy.contains(editableEvent.tags[1].label, { matchCase: false }).should('exist');
      cy.contains(editableCategoryLabel).should('exist');
      cy.contains(editableAgeRestrictionLabel).should('exist');
      cy.contains('Range').should('exist');
      cy.get('[data-cy="minPrice-input"]')
        .invoke('val')
        .should('contain', editableEvent.minPriceCents / 100);
      cy.get('[data-cy="maxPrice-input"]')
        .invoke('val')
        .should('contain', editableEvent.maxPriceCents / 100);
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
    cy.get('[data-cy="image-cropper"]').should('be.visible');
    cy.get('[data-cy="confirm-crop-button"]').should('be.visible').and('not.be.disabled').click();
    cy.get('[data-cy="image-cropper"]').should('not.exist');

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

    // Close the event modal using its close control before reopening the edit form.
    cy.get('[aria-label="Close"]').click({ force: true });
    cy.url().should('not.include', '/event/');
    cy.get('[data-cy="main-modal"]:visible').should('have.length', 0);

    // Reopen edit form and verify persisted values in form controls.
    openEditForm(updatedEvent.title);
    cy.get('[data-cy="main-modal"]:visible').within(() => {
      cy.get('[data-cy="eventName-input"]').should('have.value', updatedEvent.title);
      cy.get('[data-cy="eventDescription-input"]').should('have.value', updatedEvent.description);
      cy.get('[data-cy="location-input"]').should('have.value', 'CN Tower, Toronto');
      cy.contains(editableCategoryLabel).should('exist');
      cy.contains(editableAgeRestrictionLabel).should('exist');
      cy.contains(editableEvent.tags[0].label, { matchCase: false }).should('exist');
      cy.contains(editableEvent.tags[1].label, { matchCase: false }).should('exist');
      cy.get('[data-cy="minPrice-input"]')
        .invoke('val')
        .should('contain', editableEvent.minPriceCents / 100);
      cy.get('[data-cy="maxPrice-input"]')
        .invoke('val')
        .should('contain', editableEvent.maxPriceCents / 100);
      cy.get('img')
        .first()
        .invoke('attr', 'src')
        .should('not.contain', 'imagePlaceholder.png')
        .then((src) => {
          expect(src).to.be.a('string').and.not.be.empty;
        });
    });
    assertHeroDateTime('[data-cy="startDateTime-input"]', updatedEvent.startDateTime);
    assertHeroDateTime('[data-cy="endDateTime-input"]', updatedEvent.endDateTime);
  });

  it('shows validation and blocks preview when end date/time is before start date/time', () => {
    openEditForm(editableEvent.title);

    cy.fillHeroDateTime('[data-cy="startDateTime-input"]', {
      month: '06',
      day: '15',
      year: '2031',
      hour: '10',
      minute: '00',
      period: 'PM',
    });
    cy.fillHeroDateTime('[data-cy="endDateTime-input"]', {
      month: '06',
      day: '15',
      year: '2031',
      hour: '09',
      minute: '00',
      period: 'PM',
    });

    cy.contains('Preview Changes').click();

    cy.contains('End date/time must be after the start date/time').should('be.visible');
    cy.contains('Save Changes').should('not.exist');
    cy.contains('.Toastify__toast', 'Updated Event').should('not.exist');
  });

  it('handles submitting without changes', () => {
    openEditForm(editableEvent.title);

    cy.contains('Preview Changes').click();
    cy.contains('Save Changes').click();

    cy.contains('.Toastify__toast', 'Updated Event').should('be.visible');

    cy.get('[data-cy="my-events-container"]').within(() => {
      cy.contains(editableEvent.title).should('exist');
      cy.contains(updatedEvent.title).should('not.exist');
    });

    // Reopen to ensure no unintended field mutation occurred.
    openEditForm(editableEvent.title);
    cy.get('[data-cy="main-modal"]:visible').within(() => {
      cy.get('[data-cy="eventName-input"]').should('have.value', editableEvent.title);
      cy.get('[data-cy="eventDescription-input"]').should('have.value', editableEvent.description);
      cy.get('[data-cy="location-input"]').should('have.value', editableEvent.location.address);
      cy.contains(editableCategoryLabel).should('exist');
      cy.contains(editableAgeRestrictionLabel).should('exist');
      cy.contains(editableEvent.tags[0].label, { matchCase: false }).should('exist');
      cy.contains(editableEvent.tags[1].label, { matchCase: false }).should('exist');
      cy.get('[data-cy="minPrice-input"]')
        .invoke('val')
        .should('contain', editableEvent.minPriceCents / 100);
      cy.get('[data-cy="maxPrice-input"]')
        .invoke('val')
        .should('contain', editableEvent.maxPriceCents / 100);
    });

    assertHeroDateTime('[data-cy="startDateTime-input"]', {
      month: '05',
      day: '10',
      year: '2030',
      hour: '07',
      minute: '30',
      period: 'PM',
    });
    assertHeroDateTime('[data-cy="endDateTime-input"]', {
      month: '05',
      day: '10',
      year: '2030',
      hour: '09',
      minute: '00',
      period: 'PM',
    });
  });

  it('updates tags with a diff (removes old tags and persists new tags)', () => {
    const replacementTags = ['jazz', 'outdoor', 'family'];
    openEditForm(editableEvent.title);

    setTagsInHiddenInput(replacementTags);
    previewAndSaveChanges();

    openEditForm(editableEvent.title);
    cy.get('input[name="tags"]')
      .invoke('val')
      .then((value) => {
        const parsed = JSON.parse(String(value ?? '[]')) as string[];
        expect(parsed.sort()).to.deep.equal([...replacementTags].sort());
      });

    cy.get('[data-cy="main-modal"]:visible').within(() => {
      cy.contains('jazz', { matchCase: false }).should('exist');
      cy.contains('outdoor', { matchCase: false }).should('exist');
      cy.contains('family', { matchCase: false }).should('exist');
      cy.contains(editableEvent.tags[0].label, { matchCase: false }).should('not.exist');
      cy.contains(editableEvent.tags[1].label, { matchCase: false }).should('not.exist');
    });
  });

  it('deletes all tags and persists empty tags array', () => {
    openEditForm(editableEvent.title);

    setTagsInHiddenInput([]);
    previewAndSaveChanges();

    openEditForm(editableEvent.title);
    cy.get('input[name="tags"]').invoke('val').should('eq', '[]');
    cy.get('[data-cy="main-modal"]:visible').within(() => {
      cy.contains(editableEvent.tags[0].label, { matchCase: false }).should('not.exist');
      cy.contains(editableEvent.tags[1].label, { matchCase: false }).should('not.exist');
    });
  });

  it('shows validation error when range max price is less than min price', () => {
    openEditForm(editableEvent.title);

    // Set max price lower than min price to trigger range validation
    cy.get('[data-cy="minPrice-input"]').clear().type('50');
    cy.get('[data-cy="maxPrice-input"]').clear().type('10');
    cy.contains('Preview Changes').click({ force: true });

    cy.contains('Maximum price must be greater than or equal to minimum price').should(
      'be.visible'
    );
    cy.contains('Save Changes').should('not.exist');
    cy.contains('.Toastify__toast', 'Updated Event').should('not.exist');
  });
});
