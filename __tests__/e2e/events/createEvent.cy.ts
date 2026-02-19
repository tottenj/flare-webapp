describe('Create Event', () => {
  beforeEach(() => {
    cy.resetAndSeed();
    cy.loginTestOrg();
    cy.reload();
    cy.visit('/dashboard');
    cy.loginTestOrgClient();
    cy.get('[data-cy="square-plus-button"]').click();
    cy.contains('Create New Event').should('be.visible');
  });

  it('successfully creates an event', () => {
    cy.get("[data-cy='eventName-input']").type('Test Event');
    cy.get("[data-cy='eventDescription-input']").type('This is a test event');
    cy.usePlacesInput("[data-cy='location-input']");

    cy.get("[data-cy='image-input']").selectFile('cypress/fixtures/stockEvent.jpg', {
      force: true,
    });
    cy.contains('Confirm Crop').should('be.visible').click();
    cy.contains('Submit').click();
    cy.contains('Publish Event').should('exist').click();
    cy.contains('Created Event').should('be.visible');
    cy.contains('Test Event').should('be.visible');
  });

  it('successfully creates an event with end time', () => {
    cy.get("[data-cy='eventName-input']").type('Test Event2');
    cy.get("[data-cy='eventDescription-input']").type('This is a test event');

    cy.usePlacesInput("[data-cy='location-input']");

    cy.get("[data-cy='image-input']").selectFile('cypress/fixtures/stockEvent.jpg', {
      force: true,
    });

    cy.contains('Confirm Crop').should('be.visible').click();

    cy.fillHeroDateTime('[data-cy="startDateTime-input"]', {
      month: '03',
      day: '22',
      year: '2026',
      hour: '07',
      minute: '30',
      period: 'PM',
    });
    cy.get("[data-cy='endTime-input']").click();
    cy.fillHeroDateTime('[data-cy="endDateTime-input"]', {
      month: '03',
      day: '23',
      year: '2026',
      hour: '07',
      minute: '30',
      period: 'PM',
    });
    cy.contains('Submit').click();
    cy.contains('Publish Event').scrollIntoView().should('be.visible').click({ force: true });
    cy.contains('Created Event').should('be.visible');
    cy.contains('Test Event2').should('be.visible');
  });

  it('successfully creates event with fixed price', () => {
    cy.get("[data-cy='eventName-input']").type('Test Event');
    cy.get("[data-cy='eventDescription-input']").type('This is a test event');
    cy.usePlacesInput("[data-cy='location-input']");

    cy.get("[data-cy='image-input']").selectFile('cypress/fixtures/stockEvent.jpg', {
      force: true,
    });
    cy.contains('Confirm Crop').should('be.visible').click();
    cy.contains('Confirm Crop').should('not.exist');

    cy.get("[data-cy='priceType-input']").click({ force: true });

    cy.get('body').find("[role='listbox']").should('exist').contains('Fixed').click();
    cy.get("[data-cy='minPrice-input']").type('20');
    cy.contains('Submit').click();
    cy.contains('Publish Event').should('exist').click();
    cy.contains('Created Event').should('be.visible');
    cy.contains('Test Event').should('be.visible');
  });

  it('successfully creates event with range price', () => {
    cy.get("[data-cy='eventName-input']").type('Test Event');
    cy.get("[data-cy='eventDescription-input']").type('This is a test event');
    cy.usePlacesInput("[data-cy='location-input']");

    cy.get("[data-cy='image-input']").selectFile('cypress/fixtures/stockEvent.jpg', {
      force: true,
    });
    cy.contains('Confirm Crop').should('be.visible').click();
    cy.contains('Confirm Crop').should('not.exist');

    cy.get("[data-cy='priceType-input']").click({ force: true });

    cy.get('body').find("[role='listbox']").should('exist').contains('Range').click();
    cy.get("[data-cy='minPrice-input']").type('20');
    cy.get("[data-cy='maxPrice-input']").type('40');
    cy.contains('Submit').click();
    cy.contains('Publish Event').should('exist').click();
    cy.contains('Created Event').should('be.visible');
    cy.contains('Test Event').should('be.visible');
  });
});

describe('Create Event - Unsuccessful Flows', () => {
  beforeEach(() => {
    cy.loginTestOrg();
    cy.reload();
    cy.visit('/dashboard');
    cy.loginTestOrgClient();
    cy.get('[data-cy="square-plus-button"]').click();
    cy.contains('Create New Event').should('be.visible');
  });

  it('shows validation error when min price greater than max price', () => {
    cy.get("[data-cy='eventName-input']").type('Test Event');
    cy.get("[data-cy='eventDescription-input']").type('This is a test event');
    cy.usePlacesInput("[data-cy='location-input']");

    cy.get("[data-cy='image-input']").selectFile('cypress/fixtures/stockEvent.jpg', {
      force: true,
    });
    cy.contains('Confirm Crop').should('be.visible').click();
    cy.contains('Confirm Crop').should('not.exist');

    cy.get("[data-cy='priceType-input']").click({ force: true });

    cy.get('body').find("[role='listbox']").should('exist').contains('Range').click();
    cy.get("[data-cy='minPrice-input']").clear().type('20');
    cy.get("[data-cy='maxPrice-input']").clear().type('18');
    cy.contains('Submit').click();
    cy.contains('Maximum price must be greater than or equal to minimum price').should(
      'be.visible'
    );
  });

  it('shows validation error when required fields are missing', () => {
    cy.contains('Submit').click();
    cy.contains('Please fill out this field.').should('be.visible');
    cy.contains('Publish Event').should('not.exist');
  });

  it('shows validation error when end date less than start date', () => {
    cy.get("[data-cy='eventName-input']").type('Test Event2');
    cy.get("[data-cy='eventDescription-input']").type('This is a test event');
    cy.usePlacesInput("[data-cy='location-input']");
    cy.get("[data-cy='image-input']").selectFile('cypress/fixtures/stockEvent.jpg', {
      force: true,
    });

    cy.contains('Confirm Crop').should('be.visible').click();

    cy.get("[data-cy='endTime-input']").click();
    cy.fillHeroDateTime('[data-cy="startDateTime-input"]', {
      month: '03',
      day: '22',
      year: '2026',
      hour: '07',
      minute: '30',
      period: 'PM',
    });

    cy.fillHeroDateTime('[data-cy="endDateTime-input"]', {
      month: '02',
      day: '22',
      year: '2026',
      hour: '05',
      minute: '24',
      period: 'PM',
    });

    cy.contains('Submit').click();
    cy.contains('End date/time must be after the start date/time').should('be.visible');
    cy.contains('Publish Event').should('not.exist');
  });

  it('shows error when image is not uploaded', () => {
    cy.get("[data-cy='eventName-input']").type('Test Event');
    cy.get("[data-cy='eventDescription-input']").type('This is a test event');
    cy.usePlacesInput("[data-cy='location-input']");
    cy.contains('Submit').click();
    cy.contains('Publish Event').should('not.exist');
    cy.contains('Event image is required').should('exist');
  });
});
