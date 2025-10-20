import { createEvent } from '../../../support/constants/Event';
import { preMadeOrg } from '../../../support/constants/Organization';

function getEventFormInputs() {
  return {
    title: () => cy.get("[data-cy='title-input']"),
    description: () => cy.get("[data-cy='description-input']"),
    image: () => cy.get("[data-cy='img-input']"),
  };
}

function fillEventForm() {
  const { title, description, image } = getEventFormInputs();
  title().type(createEvent.title);
  description().type(createEvent.description);
  image().selectFile('cypress/fixtures/stockEvent.jpg');
  cy.get("[data-cy='imageCropperButton']").click();
  image()
    .invoke('val')
    .then((val) => {
      expect(val).to.contain('stockEvent.jpg');
    });
  cy.get("[data-cy='imageCropperButton']").should('not.exist');
  cy.usePlacesInput(
    "input[data-cy='location-input']",
    createEvent.location.name,
    'Art Gallery of Guelph, Gordon Street, Guelph, ON, Canada'
  );
}

describe.skip('Dashboard loads on successful sign in', () => {
  beforeEach(() => {
    cy.loginTestOrg();
    cy.visit('/dashboard');
  });

  it('Loads All Page Components', () => {
    cy.get('[data-cy="memberDetails"]')
      .should('be.visible')
      .within(() => {
        cy.contains(preMadeOrg.name);
        cy.contains(preMadeOrg.email);
        cy.contains(preMadeOrg.status);
        cy.contains(preMadeOrg.location.name);
      });
    cy.get('[data-cy="eventListing"]').should('be.visible');
    cy.get('[data-cy="eventDetails"]').should('be.visible');
  });

  it('Can open modal', () => {
    cy.get('svg[data-icon="square-plus"]').parent('button').first().click();
    cy.contains('Add Event').should('be.visible');
  });
});

describe.skip('Create', () => {
  beforeEach(() => {
    cy.loginTestOrg();
    cy.visit('/dashboard');
  });

  it('Tests the file upload', () => {
    const { image } = getEventFormInputs();
    cy.get('svg[data-icon="square-plus"]').parent('button').first().click();
    image().selectFile('cypress/fixtures/stockEvent.jpg');
    cy.get("[data-cy='imageCropperButton']").click();
    image()
      .invoke('val')
      .then((val) => {
        expect(val).to.contain('stockEvent.jpg');
        cy.log(val?.toString() ?? 'NO VAL');
      });
  });

  it('Successfully Fills in form', () => {
    cy.get('svg[data-icon="square-plus"]').parent('button').first().click();
    fillEventForm();
    cy.wait(200);
    cy.contains('Preview Event').click();
    cy.contains('Create Event').should('be.visible').click();
    cy.contains('Successfully Added Event').should("exist")
  });

  it('Checks that event is in event list', () => {
    cy.get('[data-cy="eventListing"]').should('be.visible').within(() => {
      cy.contains(createEvent.title).should("be.visible")
    })
  });
  

  it("Ensures the new event is not on the events page as it is unverified", () => {
    cy.visit("/events")
    cy.contains(createEvent.title).should("not.exist")
  })

});


describe.skip("Verified", () => {
  beforeEach(() => {
    cy.loginVerifiedOrg()
    cy.visit("/dashboard")
  })

  it("Ensures that verified is present", () => {
    cy.contains("Verified").should("exist")
  })

  it('Successfully Fills in form', () => {
    cy.get('svg[data-icon="square-plus"]').parent('button').first().click();
    fillEventForm();
    cy.wait(200);
    cy.contains('Preview Event').click();
    cy.contains('Create Event').should('be.visible').click();
    cy.contains('Successfully Added Event').should('exist');
  });


  it("Ensures Event is in the event details", () => {
    cy.get('[data-cy="eventDetails"]').should('be.visible').within(() => {
      cy.contains(createEvent.title).should("be.visible")
      cy.contains(createEvent.description).should("be.visible")
    })
  })


  it("Ensure event appears on events page", () => {
    cy.visit("/events")
    cy.contains(createEvent.title).should("be.visible")
  })

})