import { pendingOrg } from '../constants';

describe('General', () => {
  beforeEach(() => {
    cy.loginTestOrg();
    cy.reload();
    cy.visit('/dashboard');
    cy.loginTestOrgClient();
  });

  it('Successfully Loads Org Dashboard', () => {
    cy.contains(pendingOrg.orgName).should('be.visible');
    cy.contains(pendingOrg.email).should('be.visible');
    cy.get('[data-cy="upcoming-container"]').should('exist').and('be.visible');
    cy.get('[data-cy="my-events-container"]').should('exist').and('be.visible');
    cy.contains('Next Upcoming Event').should('be.visible');
    cy.contains('My Events').should('be.visible');
  });

  it('Successfully Loads Next Upcoming Event', () => {
    cy.get('[data-cy="upcoming-container"]').within(() => {
      cy.contains('Upcoming Event').should('be.visible');
      cy.contains('Free').should('be.visible');
      cy.contains('Mar').should('be.visible');
      cy.contains('unverifiedOrg').should('be.visible');
    });
  });
});

describe('Profile Picture - Success Flow', () => {
  beforeEach(() => {
    cy.loginTestOrg();
    cy.reload();
    cy.visit('/dashboard');
    cy.loginTestOrgClient();
  });

  it('Uploads profile picture successfully', () => {
    cy.get('[data-cy=profile-pic-input]').selectFile('cypress/fixtures/avatar.webp', {
      force: true,
    });

    cy.contains('.Toastify__toast', 'Successfully Uploaded File', {
      timeout: 10000,
    }).should('be.visible');

    cy.reload();
  });

  it('Persists profile picture after reload', () => {
    cy.get('[data-cy=profile-picture]', { timeout: 10000 }).invoke('attr', 'src').as('initialSrc');

    cy.reload();

    cy.get('@initialSrc').then((src) => {
      cy.get('[data-cy=profile-picture]').invoke('attr', 'src').should('eq', src);
    });
  });
});

describe('Profile Picture - Unsuccessful Flow', () => {
  beforeEach(() => {
    cy.clearStorage();
    cy.loginTestOrg();
    cy.reload();
    cy.visit('/dashboard');
    cy.loginTestOrgClient();
  });

  it('fails on file too large', () => {
    cy.get('[data-cy=profile-pic-input]').selectFile(
      {
        contents: Cypress.Buffer.alloc(10 * 1024 * 1024), // 10MB
        fileName: 'big-image.jpg',
        mimeType: 'image/jpeg',
        lastModified: Date.now(),
      },
      { force: true }
    );

    cy.contains('.Toastify__toast', 'Image must be under 5MB', {
      timeout: 10000,
    }).should('be.visible');
  });
});

describe('Events List', () => {
  beforeEach(() => {
    cy.loginTestOrg();
    cy.reload();
    cy.visit('/dashboard');
    cy.loginTestOrgClient();
  });

  it('Successfully loads published event in my events list on default', () => {
    cy.get('[data-cy="my-events-container"]').within(() => {
      cy.contains('Another Published Event').should('be.visible');
      cy.contains('Mar').should('be.visible');
      cy.contains('All Ages').should('be.visible');
    });
  });

  it('Successfully loads published events in my events list when clicked', () => {
    cy.get('[data-cy="tab-published"]').click();

    cy.get('[data-cy="my-events-container"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Another Published Event').should('be.visible');
        cy.contains('Mar').should('be.visible');
        cy.contains('All Ages').should('be.visible');
        cy.contains('Draft Event').should('not.exist');
      });
  });

  it('Successfully loads draft events in my events list', () => {
    cy.get('[data-cy="tab-draft"]').click();
    cy.get('[data-cy="my-events-container"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Mar').should('be.visible');
        cy.contains('All Ages').should('be.visible');
        cy.contains('Draft Event').should('be.visible');
        cy.contains('Another Published Event').should('not.exist');
      });
  });

  it('Loads draft events from URL filter', () => {
    cy.visit('/dashboard?status=draft');
    cy.get('[data-cy="my-events-container"]').within(() => {
      cy.contains('Draft Event').should('be.visible');
    });
  });
});
