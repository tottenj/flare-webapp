const sampleOrg = {
  name: 'organization name',
  email: 'example@gmail.com',
  password: 'password123',
  instagram: 'instahandle',
  facebook: 'facebookhandle',
  twitter: 'twitterhandle',
};
describe('Org Sign Up - Successful Flow', () => {
  beforeEach(() => {
    cy.resetAndSeed();
    cy.clearAllEmulators();
    cy.visit('/flare-signup');
  });

  it('tests success flow - no proof', () => {
    cy.get("[data-cy='orgName-input']").type(sampleOrg.name);
    cy.get("[data-cy='email-input']").type(sampleOrg.email);
    cy.usePlacesInput("[data-cy='location-input']");
    cy.get("[data-cy='password-input']").type(sampleOrg.password);
    cy.contains('Submit').click();
    cy.recivedOobCode(sampleOrg.email);
    cy.url().should('include', '/confirmation');
  });

  it('tests success flow - with proof', () => {
    cy.get("[data-cy='orgName-input']").type(sampleOrg.name);
    cy.get("[data-cy='email-input']").type(sampleOrg.email);
    cy.usePlacesInput("[data-cy='location-input']");
    cy.get("[data-cy='password-input']").type(sampleOrg.password);

    cy.get("[data-cy='instagram-input']").type(sampleOrg.instagram),
      cy.get("[data-cy='facebook-input']").type(sampleOrg.facebook),
      cy.get("[data-cy='twitter-input']").type(sampleOrg.twitter);

    cy.contains('Submit').click();
    cy.url().should('include', '/confirmation');
  });

  it('successfully signs up an org with social proof files', () => {
    cy.get("[data-cy='orgName-input']").type(sampleOrg.name);
    cy.get("[data-cy='email-input']").type(sampleOrg.email);
    cy.usePlacesInput("[data-cy='location-input']");
    cy.get("[data-cy='password-input']").type(sampleOrg.password);

    // --- Social handles ---
    cy.get("[data-cy='instagram-input']").type(sampleOrg.instagram);
    cy.get("[data-cy='facebook-input']").type(sampleOrg.facebook);
    cy.get("[data-cy='twitter-input']").type(sampleOrg.twitter);

    // --- Upload proof files ---
    cy.get("[data-cy='instagram-file-input']").selectFile('cypress/fixtures/proof.jpg', {
      force: true,
    });
    cy.get("[data-cy='facebook-file-input']").selectFile('cypress/fixtures/proof.jpg', {
      force: true,
    });
    cy.get("[data-cy='twitter-file-input']").selectFile('cypress/fixtures/proof.jpg', {
      force: true,
    });

    cy.get("[data-cy='instagram-file-input']").parent().should('have.class', 'bg-green');
    cy.get("[data-cy='facebook-file-input']").parent().should('have.class', 'bg-green');
    cy.get("[data-cy='twitter-file-input']").parent().should('have.class', 'bg-green');
    cy.get("[data-cy='instagram-file-input']").parent().find('svg').should('exist');
    cy.contains('Submit').click();
    cy.url().should('include', '/confirmation');
  });
});

describe('Org Sign Up - Unsuccessful Flow', () => {
  beforeEach(() => {
    cy.resetAndSeed();
    cy.clearAllEmulators();
    cy.seedAuthEmulator();
    cy.visit('/flare-signup');
  });

  it('shows error if user already exists', () => {
    cy.get("[data-cy='orgName-input']").type(sampleOrg.name);
    cy.get("[data-cy='email-input']").type('unverifiedOrg@gmail.com');
    cy.usePlacesInput("[data-cy='location-input']");
    cy.get("[data-cy='password-input']").type(sampleOrg.password);
    cy.contains('Submit').click();

    cy.contains('An account with this email already exists.').should('be.visible');
    cy.url().should('include', '/flare-signup');
  });

  it('shows error if email invalid', () => {
    cy.get("[data-cy='orgName-input']").type(sampleOrg.name);
    cy.get("[data-cy='email-input']").type('unverifiedOrg');
    cy.usePlacesInput("[data-cy='location-input']");
    cy.get("[data-cy='password-input']").type(sampleOrg.password);
    cy.contains('Submit').click();

    cy.contains('Please enter a valid email address.').should('be.visible');
    cy.url().should('include', '/flare-signup');
  });
});
